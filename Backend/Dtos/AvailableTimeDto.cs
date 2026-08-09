namespace Backend.Dtos;

public class AvailableTimeDto
{
    public DateTime AppointmentDateTime { get; set; }

    public string DisplayTime { get; set; } = string.Empty;

    public string EndTime { get; set; } = string.Empty;

    public int DurationMinutes { get; set; }
}