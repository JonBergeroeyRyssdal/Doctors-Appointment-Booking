public class UpdateAppointmentDto
{
    public int ClinicId { get; set; }
    public int DoctorId { get; set; }
    public int SpecialityId { get; set; }
    public DateTime AppointmentDateTime { get; set; }
    public int DurationMinutes { get; set; }
    public string? MessageToDoctor { get; set; }
}