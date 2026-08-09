namespace Backend.Models;

public class Appointment
{
    public int Id { get; set; }

    public DateTime AppointmentDateTime { get; set; }

    public int DurationMinutes { get; set; }

    public string Status { get; set; } = "Booked";

    public string? MessageToDoctor { get; set; }

    // Patient relationship
    public int PatientId { get; set; }

    public Patient? Patient { get; set; }

    // Clinic relationship
    public int ClinicId { get; set; }

    public Clinic? Clinic { get; set; }

    // Doctor relationship
    public int DoctorId { get; set; }

    public Doctor? Doctor { get; set; }

    // Speciality relationship
    public int SpecialityId { get; set; }

    public Speciality? Speciality { get; set; }
}