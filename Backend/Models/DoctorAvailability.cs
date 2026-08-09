namespace Backend.Models;

public class DoctorAvailability
{
    public int Id { get; set; }

    public int DoctorId { get; set; }

    public Doctor? Doctor { get; set; }

    // 0 = Sunday, 1 = Monday, 2 = Tuesday, etc.
    public DayOfWeek DayOfWeek { get; set; }

    public TimeSpan StartTime { get; set; } = new TimeSpan(8, 0, 0);
    public TimeSpan EndTime { get; set; } = new TimeSpan(16, 0, 0);


}