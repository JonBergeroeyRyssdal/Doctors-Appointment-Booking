using Backend.Data;
using Backend.Dtos;
using Backend.Models;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;

// Only use an explicitly supplied test server. Never load the application's .env.
var connection = Environment.GetEnvironmentVariable("TEST_MYSQL_CONNECTION_STRING");
if (string.IsNullOrWhiteSpace(connection))
{
    Console.Error.WriteLine("Set TEST_MYSQL_CONNECTION_STRING to a MySQL test server with CREATE DATABASE permission.");
    return 2;
}

var settings = new MySqlConnectionStringBuilder(connection)
{
    Database = "booking_concurrency_test_" + Guid.NewGuid().ToString("N"),
    Pooling = false
};
var options = new DbContextOptionsBuilder<AppDbContext>().UseMySQL(settings.ConnectionString).Options;
AppDbContext Context() => new(options);
await using var setup = Context();
var created = false;
try
{
    created = await setup.Database.EnsureCreatedAsync();
    if (!created) throw new Exception("Expected a new isolated test database.");
    var clinic = new Clinic { Name = "Test clinic" };
    var speciality = new Speciality { Name = "Test speciality" };
    setup.AddRange(clinic, speciality);
    await setup.SaveChangesAsync();
    var doctors = Enumerable.Range(1, 2).Select(i => new Doctor
    {
        FirstName = "Doctor", LastName = i.ToString(), ClinicId = clinic.Id,
        SpecialityId = speciality.Id,
        Availabilities = Enum.GetValues<DayOfWeek>().Select(day => new DoctorAvailability
        {
            DayOfWeek = day, StartTime = TimeSpan.FromHours(8), EndTime = TimeSpan.FromHours(16)
        }).ToList()
    }).ToArray();
    var patients = Enumerable.Range(1, 2).Select(i => new Patient
    {
        FirstName = "Patient", LastName = i.ToString(), Email = $"patient{i}@example.test"
    }).ToArray();
    setup.AddRange(doctors);
    setup.AddRange(patients);
    await setup.SaveChangesAsync();
    var date = DateTime.Today.AddDays(3).AddHours(9);

    CreatePatientAppointmentDto Booking(int doctor, DateTime? time = null) => new()
    {
        ClinicId = clinic.Id, SpecialityId = speciality.Id, DoctorId = doctors[doctor].Id,
        AppointmentDateTime = time ?? date, DurationMinutes = 30
    };
    UpdateAppointmentDto Update(int doctor, DateTime? time = null) => new()
    {
        ClinicId = clinic.Id, SpecialityId = speciality.Id, DoctorId = doctors[doctor].Id,
        AppointmentDateTime = time ?? date, DurationMinutes = 30
    };
    async Task<AppointmentServiceResult> Run(Func<AppointmentService, Task<AppointmentServiceResult>> operation)
    {
        await using var context = Context();
        return await operation(new AppointmentService(context));
    }
    async Task Reset() => await setup.Appointments.ExecuteDeleteAsync();
    void Check(bool condition, string message)
    {
        if (!condition) throw new Exception(message);
    }
    async Task<AppointmentServiceResult[]> Race(
        Func<AppointmentService, Task<AppointmentServiceResult>> first,
        Func<AppointmentService, Task<AppointmentServiceResult>> second)
    {
        var gate = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
        async Task<AppointmentServiceResult> Start(Func<AppointmentService, Task<AppointmentServiceResult>> action)
        {
            await gate.Task;
            return await Run(action);
        }
        var tasks = new[] { Start(first), Start(second) };
        gate.SetResult();
        return await Task.WhenAll(tasks).WaitAsync(TimeSpan.FromSeconds(30));
    }
    void OneWinner(AppointmentServiceResult[] results) =>
        Check(results.Count(r => r.Success) == 1 && results.Count(r => !r.Success && r.StatusCode == 400) == 1,
            "Expected one successful booking and one rejected conflict.");

    // Hold a real doctor row lock so both requests must wait before validating.
    await using (var blocker = new MySqlConnection(settings.ConnectionString))
    {
        await blocker.OpenAsync();
        await using var transaction = await blocker.BeginTransactionAsync();
        await using var command = blocker.CreateCommand();
        command.Transaction = transaction;
        command.CommandText = "SELECT `Id` FROM `Doctors` WHERE `Id` = @id FOR UPDATE";
        command.Parameters.AddWithValue("@id", doctors[0].Id);
        await command.ExecuteScalarAsync();
        var first = Run(s => s.CreateLoggedInPatientAppointmentAsync(Booking(0), patients[0].Id));
        var second = Run(s => s.CreateLoggedInPatientAppointmentAsync(Booking(0), patients[1].Id));
        await Task.Delay(300);
        Check(!first.IsCompleted && !second.IsCompleted, "Bookings bypassed the database lock.");
        await transaction.CommitAsync();
        OneWinner(await Task.WhenAll(first, second).WaitAsync(TimeSpan.FromSeconds(30)));
    }
    Console.WriteLine("PASS: requests wait for doctor lock and recheck after release");

    // Different start times must still conflict when their durations overlap.
    for (var repeat = 0; repeat < 10; repeat++)
    {
        await Reset();
        OneWinner(await Race(
            s => s.CreateLoggedInPatientAppointmentAsync(Booking(0), patients[0].Id),
            s => s.CreateLoggedInPatientAppointmentAsync(Booking(0, date.AddMinutes(15)), patients[1].Id)));
        Check(await setup.Appointments.CountAsync() == 1, "Doctor was double-booked.");
        await Reset();
        OneWinner(await Race(
            s => s.CreateLoggedInPatientAppointmentAsync(Booking(0), patients[0].Id),
            s => s.CreateLoggedInPatientAppointmentAsync(Booking(1), patients[0].Id)));
        Check(await setup.Appointments.CountAsync() == 1, "Patient was double-booked across doctors.");
    }
    Console.WriteLine("PASS: concurrent doctor and patient conflicts (10 repetitions each)");

    await Reset();
    var adjacent = await Race(
        s => s.CreateLoggedInPatientAppointmentAsync(Booking(0), patients[0].Id),
        s => s.CreateLoggedInPatientAppointmentAsync(Booking(0, date.AddMinutes(30)), patients[1].Id));
    Check(adjacent.All(r => r.Success), "Adjacent appointments should both succeed.");
    Console.WriteLine("PASS: adjacent appointments");

    await Reset();
    var original = await Run(s => s.CreateLoggedInPatientAppointmentAsync(Booking(0, date.AddHours(1)), patients[0].Id));
    var id = ((AppointmentDto)original.Data!).Id;
    OneWinner(await Race(
        s => s.UpdateAppointmentAsync(id, Update(1), patients[0].Id),
        s => s.CreateLoggedInPatientAppointmentAsync(Booking(1), patients[1].Id)));
    Check(await setup.Appointments.CountAsync(a => a.DoctorId == doctors[1].Id && a.AppointmentDateTime == date) == 1,
        "Update raced with creation and double-booked the destination doctor.");
    Console.WriteLine("PASS: update versus creation on another doctor");

    await Reset();
    original = await Run(s => s.CreateLoggedInPatientAppointmentAsync(Booking(0), patients[0].Id));
    id = ((AppointmentDto)original.Data!).Id;
    var cancellation = await Race(
        s => s.CancelAppointmentAsync(id, patients[0].Id),
        s => s.UpdateAppointmentAsync(id, Update(1), patients[0].Id));
    Check(cancellation[0].Success, "Cancellation failed.");
    Check(await setup.Appointments.AnyAsync(a => a.Id == id && a.Status == "Cancelled"),
        "A concurrent update restored a cancelled appointment.");
    var rebooking = await Run(s => s.CreateLoggedInPatientAppointmentAsync(Booking(0), patients[1].Id));
    Check(rebooking.Success, "Cancelled appointments should not block rebooking.");
    Console.WriteLine("PASS: cancellation versus update, and rebooking after cancellation");

    await Reset();
    var email = "newguest@example.test";
    CreatePatientAppointmentDto Guest(int doctor)
    {
        var dto = Booking(doctor);
        dto.FirstName = "New";
        dto.LastName = "Guest";
        dto.Email = email;
        return dto;
    }
    OneWinner(await Race(s => s.CreateGuestAppointmentAsync(Guest(0)), s => s.CreateGuestAppointmentAsync(Guest(1))));
    Check(await setup.Patients.CountAsync(p => p.Email == email) == 1, "Guest identity was duplicated.");
    Check(await setup.Appointments.CountAsync() == 1, "Guest was double-booked.");
    Console.WriteLine("PASS: concurrent bookings for a new guest");
    return 0;
}
finally
{
    // Only the randomly named database created by this run is removed.
    if (created) await setup.Database.EnsureDeletedAsync();
}
