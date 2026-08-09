namespace Backend.Dtos;

public class AvailableTimesResultDto
{
    public bool Success { get; set; }

    public string? Message { get; set; }

    public List<AvailableTimeDto> AvailableTimes { get; set; } = new();
}