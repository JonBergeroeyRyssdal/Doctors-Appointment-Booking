namespace Backend.Dtos;

public class CreatePatientAppointmentDto
{
    // Guest patient info
    public string FirstName { get; set; } = "";

    public string LastName { get; set; } = "";

    public string Email { get; set; } = "";

    public DateTime? Birthdate { get; set; }

    // Appointment info
    public int ClinicId { get; set; }

    public int SpecialityId { get; set; }

    public int DoctorId { get; set; }

    public DateTime AppointmentDateTime { get; set; }

    public int DurationMinutes { get; set; }

    public string? MessageToDoctor { get; set; }
}