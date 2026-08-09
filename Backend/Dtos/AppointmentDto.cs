namespace Backend.Dtos;

public class AppointmentDto
{
    public int Id { get; set; }

    public DateTime AppointmentDateTime { get; set; }
    public int DurationMinutes { get; set; }

    public DateTime EndDateTime { get; set; }
    public string DisplayTime { get; set; } = "";
    public string EndTime { get; set; } = "";

    public string Status { get; set; } = "";
    public string? MessageToDoctor { get; set; }

    public int PatientId { get; set; }
    public string? PatientName { get; set; }

    public int ClinicId { get; set; }
    public string? ClinicName { get; set; }

    public int DoctorId { get; set; }
    public string? DoctorName { get; set; }
    public string? DoctorFirstName { get; set; }
    public string? DoctorLastName { get; set; }

    public int SpecialityId { get; set; }
    public string? SpecialityName { get; set; }
}