using Backend.Data;
using Backend.Dtos;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using MySql.Data.MySqlClient;
using System.Data;

namespace Backend.Services;

public class AppointmentService
{
    private readonly AppDbContext _context;

    private readonly TimeSpan _lunchStartTime = new TimeSpan(11, 30, 0);
    private readonly TimeSpan _lunchEndTime = new TimeSpan(12, 30, 0);

    public AppointmentService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<AppointmentServiceResult> CreateGuestAppointmentAsync(
        CreatePatientAppointmentDto dto
    )
    {
        if (string.IsNullOrWhiteSpace(dto.FirstName) ||
            string.IsNullOrWhiteSpace(dto.LastName) ||
            string.IsNullOrWhiteSpace(dto.Email))
        {
            return AppointmentServiceResult.Fail(
                "Guest booking requires first name, last name and email."
            );
        }

        var email = dto.Email.Trim().ToLower();

        var patient = await _context.Patients
            .FirstOrDefaultAsync(p => p.Email.ToLower() == email);

        if (patient == null)
        {
            patient = new Patient
            {
                FirstName = dto.FirstName.Trim(),
                LastName = dto.LastName.Trim(),
                Email = email,
                Birthdate = dto.Birthdate,
                Role = "Guest"
            };

            _context.Patients.Add(patient);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException exception) when (
                exception.InnerException is MySqlException { Number: 1062 })
            {
                // A concurrent guest request may have created the same email.
                _context.Entry(patient).State = EntityState.Detached;
                patient = await _context.Patients.SingleAsync(p => p.Email == email);
            }
        }

        return await CreateAppointmentForPatientAsync(dto, patient.Id);
    }

    public async Task<AppointmentServiceResult>
        CreateLoggedInPatientAppointmentAsync(
            CreatePatientAppointmentDto dto,
            int patientId
        )
    {
        var patientExists = await _context.Patients
            .AnyAsync(p => p.Id == patientId);

        if (!patientExists)
        {
            return AppointmentServiceResult.Fail(
                "Patient not found.",
                404
            );
        }

        return await CreateAppointmentForPatientAsync(dto, patientId);
    }

    public async Task<AppointmentServiceResult> UpdateAppointmentAsync(
        int appointmentId,
        UpdateAppointmentDto dto,
        int patientId
    )
    {
        await using var transaction = await _context.Database
            .BeginTransactionAsync(IsolationLevel.ReadCommitted);
        await LockPatientAsync(patientId);
        await LockDoctorAsync(dto.DoctorId);

        var appointment = await _context.Appointments
            .FirstOrDefaultAsync(a =>
                a.Id == appointmentId &&
                a.PatientId == patientId
            );

        if (appointment == null)
        {
            return AppointmentServiceResult.Fail(
                "Appointment not found.",
                404
            );
        }

        if (appointment.Status == "Cancelled")
        {
            return AppointmentServiceResult.Fail(
                "Cannot update a cancelled appointment."
            );
        }

        if (IsWithin24Hours(appointment))
        {
            return AppointmentServiceResult.Fail(
                "Less than 24 hours until the appointment. Please contact the clinic directly."
            );
        }

        var validationResult = await ValidateAppointmentDataAsync(
            dto.ClinicId,
            dto.SpecialityId,
            dto.DoctorId,
            dto.AppointmentDateTime,
            dto.DurationMinutes,
            patientId,
            appointmentId
        );

        if (!validationResult.Success)
        {
            return AppointmentServiceResult.Fail(validationResult.Message);
        }

        appointment.ClinicId = dto.ClinicId;
        appointment.SpecialityId = dto.SpecialityId;
        appointment.DoctorId = dto.DoctorId;
        appointment.AppointmentDateTime = dto.AppointmentDateTime;
        appointment.DurationMinutes = dto.DurationMinutes;
        appointment.MessageToDoctor = dto.MessageToDoctor;
        appointment.Status = "Booked";

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        var dtoResult = BuildAppointmentDto(
            appointment,
            validationResult.Clinic!,
            validationResult.Speciality!,
            validationResult.Doctor!
        );

        return AppointmentServiceResult.Ok(dtoResult);
    }

    public async Task<AppointmentServiceResult> CancelAppointmentAsync(
        int appointmentId,
        int patientId
    )
    {
        await using var transaction = await _context.Database
            .BeginTransactionAsync(IsolationLevel.ReadCommitted);
        await LockPatientAsync(patientId);

        var appointment = await _context.Appointments
            .FirstOrDefaultAsync(a =>
                a.Id == appointmentId &&
                a.PatientId == patientId
            );

        if (appointment == null)
        {
            return AppointmentServiceResult.Fail(
                "Appointment not found.",
                404
            );
        }

        if (appointment.Status == "Cancelled")
        {
            return AppointmentServiceResult.Fail(
                "Appointment is already cancelled."
            );
        }

        if (IsWithin24Hours(appointment))
        {
            return AppointmentServiceResult.Fail(
                "Less than 24 hours until the appointment. Please contact the clinic directly."
            );
        }

        appointment.Status = "Cancelled";

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return AppointmentServiceResult.Ok(new
        {
            message = "Appointment cancelled."
        });
    }

    private async Task<AppointmentServiceResult>
        CreateAppointmentForPatientAsync(
            CreatePatientAppointmentDto dto,
            int patientId
        )
    {
        await using var transaction = await _context.Database
            .BeginTransactionAsync(IsolationLevel.ReadCommitted);
        await LockPatientAsync(patientId);
        await LockDoctorAsync(dto.DoctorId);

        var validationResult = await ValidateAppointmentDataAsync(
            dto.ClinicId,
            dto.SpecialityId,
            dto.DoctorId,
            dto.AppointmentDateTime,
            dto.DurationMinutes,
            patientId,
            null
        );

        if (!validationResult.Success)
        {
            return AppointmentServiceResult.Fail(validationResult.Message);
        }

        var appointment = new Appointment
        {
            PatientId = patientId,
            ClinicId = dto.ClinicId,
            SpecialityId = dto.SpecialityId,
            DoctorId = dto.DoctorId,
            AppointmentDateTime = dto.AppointmentDateTime,
            DurationMinutes = dto.DurationMinutes,
            MessageToDoctor = dto.MessageToDoctor,
            Status = "Booked"
        };

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        var dtoResult = BuildAppointmentDto(
            appointment,
            validationResult.Clinic!,
            validationResult.Speciality!,
            validationResult.Doctor!
        );

        return AppointmentServiceResult.Ok(dtoResult);
    }

    private Task LockPatientAsync(int patientId) =>
        LockRowAsync("SELECT `Id` FROM `Patients` WHERE `Id` = @id FOR UPDATE", patientId);

    private Task LockDoctorAsync(int doctorId) =>
        LockRowAsync("SELECT `Id` FROM `Doctors` WHERE `Id` = @id FOR UPDATE", doctorId);

    private async Task LockRowAsync(string sql, int id)
    {
        // Always lock patient before doctor. Lock parent rows even when no bookings exist.
        // READ COMMITTED lets overlap checks see bookings committed while waiting.
        // Disposal rolls back on early return or exceptions and releases all locks.
        var transaction = _context.Database.CurrentTransaction
            ?? throw new InvalidOperationException("Booking locks require an active transaction.");
        await using var command = _context.Database.GetDbConnection().CreateCommand();
        command.Transaction = transaction.GetDbTransaction();
        command.CommandText = sql;
        var parameter = command.CreateParameter();
        parameter.ParameterName = "@id";
        parameter.Value = id;
        command.Parameters.Add(parameter);
        await command.ExecuteScalarAsync();
    }

    private async Task<AppointmentValidationResult>
        ValidateAppointmentDataAsync(
            int clinicId,
            int specialityId,
            int doctorId,
            DateTime appointmentDateTime,
            int durationMinutes,
            int patientId,
            int? appointmentIdToIgnore
        )
    {
        var allowedDurations = new[] { 15, 30, 45, 60 };

        if (!allowedDurations.Contains(durationMinutes))
        {
            return AppointmentValidationResult.Fail(
                "Duration must be 15, 30, 45 or 60 minutes."
            );
        }

        if (appointmentDateTime < DateTime.Now)
        {
            return AppointmentValidationResult.Fail(
                "Appointment date cannot be in the past."
            );
        }

        if (appointmentDateTime > DateTime.Now.AddMonths(2))
        {
            return AppointmentValidationResult.Fail(
                "Appointments can only be booked up to 2 months in advance."
            );
        }

        if (appointmentDateTime.Minute % 15 != 0 ||
            appointmentDateTime.Second != 0)
        {
            return AppointmentValidationResult.Fail(
                "Appointment must start on a 15-minute interval."
            );
        }

        var doctor = await _context.Doctors
            .Include(d => d.Availabilities)
            .FirstOrDefaultAsync(d => d.Id == doctorId);

        if (doctor == null)
        {
            return AppointmentValidationResult.Fail("Doctor not found.");
        }

        var clinic = await _context.Clinics.FindAsync(clinicId);

        if (clinic == null)
        {
            return AppointmentValidationResult.Fail("Clinic not found.");
        }

        var speciality = await _context.Specialities
            .FindAsync(specialityId);

        if (speciality == null)
        {
            return AppointmentValidationResult.Fail("Speciality not found.");
        }

        var appointmentStartDateTime = appointmentDateTime;
        var appointmentEndDateTime =
            appointmentStartDateTime.AddMinutes(durationMinutes);

        var appointmentDay = appointmentStartDateTime.DayOfWeek;
        var appointmentTime = appointmentStartDateTime.TimeOfDay;
        var appointmentEndTime = appointmentEndDateTime.TimeOfDay;

        var availability = doctor.Availabilities.FirstOrDefault(a =>
            a.DayOfWeek == appointmentDay &&
            appointmentTime >= a.StartTime &&
            appointmentEndTime <= a.EndTime
        );

        if (availability == null)
        {
            return AppointmentValidationResult.Fail(
                "Appointment time is outside doctor's working hours."
            );
        }

        var lunchStartDateTime =
            appointmentStartDateTime.Date + _lunchStartTime;

        var lunchEndDateTime =
            appointmentStartDateTime.Date + _lunchEndTime;

        var overlapsLunch =
            appointmentStartDateTime < lunchEndDateTime &&
            appointmentEndDateTime > lunchStartDateTime;

        if (overlapsLunch)
        {
            return AppointmentValidationResult.Fail(
                "Appointment cannot overlap with lunch break."
            );
        }

        var doctorAppointments = await _context.Appointments
            .Where(a =>
                a.DoctorId == doctorId &&
                a.AppointmentDateTime.Date == appointmentStartDateTime.Date &&
                a.Status != "Cancelled" &&
                (
                    appointmentIdToIgnore == null ||
                    a.Id != appointmentIdToIgnore
                ))
            .ToListAsync();

        var doctorAlreadyBooked = doctorAppointments.Any(a =>
        {
            var existingStart = a.AppointmentDateTime;
            var existingEnd =
                a.AppointmentDateTime.AddMinutes(a.DurationMinutes);

            return appointmentStartDateTime < existingEnd &&
                   appointmentEndDateTime > existingStart;
        });

        if (doctorAlreadyBooked)
        {
            return AppointmentValidationResult.Fail(
                "Doctor is already booked during this time."
            );
        }

        var patientAppointments = await _context.Appointments
            .Where(a =>
                a.PatientId == patientId &&
                a.AppointmentDateTime.Date == appointmentStartDateTime.Date &&
                a.Status != "Cancelled" &&
                (
                    appointmentIdToIgnore == null ||
                    a.Id != appointmentIdToIgnore
                ))
            .ToListAsync();

        var patientAlreadyBooked = patientAppointments.Any(a =>
        {
            var existingStart = a.AppointmentDateTime;
            var existingEnd =
                a.AppointmentDateTime.AddMinutes(a.DurationMinutes);

            return appointmentStartDateTime < existingEnd &&
                   appointmentEndDateTime > existingStart;
        });

        if (patientAlreadyBooked)
        {
            return AppointmentValidationResult.Fail(
                "Patient already has an appointment during this time."
            );
        }

        return AppointmentValidationResult.Ok(
            doctor,
            clinic,
            speciality
        );
    }

    private bool IsWithin24Hours(Appointment appointment)
    {
        return (appointment.AppointmentDateTime - DateTime.Now).TotalHours < 24;
    }

    private AppointmentDto BuildAppointmentDto(
        Appointment appointment,
        Clinic clinic,
        Speciality speciality,
        Doctor doctor
    )
    {
        var appointmentEndDateTime =
            appointment.AppointmentDateTime.AddMinutes(
                appointment.DurationMinutes
            );

        return new AppointmentDto
        {
            Id = appointment.Id,
            PatientId = appointment.PatientId,
            ClinicId = appointment.ClinicId,
            ClinicName = clinic.Name,
            SpecialityId = appointment.SpecialityId,
            SpecialityName = speciality.Name,
            DoctorId = appointment.DoctorId,
            DoctorName = doctor.FirstName + " " + doctor.LastName,
            DoctorFirstName = doctor.FirstName,
            DoctorLastName = doctor.LastName,
            AppointmentDateTime = appointment.AppointmentDateTime,
            DurationMinutes = appointment.DurationMinutes,
            EndDateTime = appointmentEndDateTime,
            DisplayTime = appointment.AppointmentDateTime.ToString("HH:mm"),
            EndTime = appointmentEndDateTime.ToString("HH:mm"),
            Status = appointment.Status,
            MessageToDoctor = appointment.MessageToDoctor
        };
    }
}

public class AppointmentServiceResult
{
    public bool Success { get; set; }
    public string Message { get; set; } = "";
    public int StatusCode { get; set; } = 400;
    public object? Data { get; set; }

    public static AppointmentServiceResult Ok(object data)
    {
        return new AppointmentServiceResult
        {
            Success = true,
            StatusCode = 200,
            Data = data
        };
    }

    public static AppointmentServiceResult Fail(
        string message,
        int statusCode = 400
    )
    {
        return new AppointmentServiceResult
        {
            Success = false,
            Message = message,
            StatusCode = statusCode
        };
    }
}

public class AppointmentValidationResult
{
    public bool Success { get; set; }
    public string Message { get; set; } = "";
    public Doctor? Doctor { get; set; }
    public Clinic? Clinic { get; set; }
    public Speciality? Speciality { get; set; }

    public static AppointmentValidationResult Ok(
        Doctor doctor,
        Clinic clinic,
        Speciality speciality
    )
    {
        return new AppointmentValidationResult
        {
            Success = true,
            Doctor = doctor,
            Clinic = clinic,
            Speciality = speciality
        };
    }

    public static AppointmentValidationResult Fail(string message)
    {
        return new AppointmentValidationResult
        {
            Success = false,
            Message = message
        };
    }
}
