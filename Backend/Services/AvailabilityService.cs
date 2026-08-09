using Backend.Data;
using Backend.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class AvailabilityService
{
    private readonly AppDbContext _context;

    public AvailabilityService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<AvailableTimesResultDto> GetAvailableTimes(
        int doctorId,
        DateTime date,
        int durationMinutes)
    {
        var allowedDurations = new[] { 15, 30, 45, 60 };

        if (!allowedDurations.Contains(durationMinutes))
        {
            return new AvailableTimesResultDto
            {
                Success = false,
                Message = "Duration must be 15, 30, 45 or 60 minutes."
            };
        }

        var doctor = await _context.Doctors.FindAsync(doctorId);

        if (doctor == null)
        {
            return new AvailableTimesResultDto
            {
                Success = false,
                Message = "Doctor not found."
            };
        }

        var availabilities = await _context.DoctorAvailabilities
            .Where(a =>
                a.DoctorId == doctorId &&
                a.DayOfWeek == date.DayOfWeek)
            .OrderBy(a => a.StartTime)
            .ToListAsync();

        if (!availabilities.Any())
        {
            return new AvailableTimesResultDto
            {
                Success = true,
                AvailableTimes = new List<AvailableTimeDto>()
            };
        }

        var bookedAppointments = await _context.Appointments
            .Where(a =>
                a.DoctorId == doctorId &&
                a.AppointmentDateTime.Date == date.Date &&
                a.Status != "Cancelled")
            .ToListAsync();

        var availableTimes = new List<AvailableTimeDto>();

        foreach (var availability in availabilities)
        {
            var currentTime = availability.StartTime;

            while (currentTime < availability.EndTime)
            {
                var appointmentDateTime = date.Date + currentTime;

                var appointmentEndTime =
                    appointmentDateTime.AddMinutes(durationMinutes);

                var appointmentEndTimeOnly =
                    currentTime.Add(TimeSpan.FromMinutes(durationMinutes));

                if (appointmentEndTimeOnly > availability.EndTime)
                {
                    currentTime = currentTime.Add(TimeSpan.FromMinutes(15));
                    continue;
                }

                var overlapsAppointment = bookedAppointments.Any(a =>
                {
                    var existingStart = a.AppointmentDateTime;

                    var existingEnd =
                        a.AppointmentDateTime.AddMinutes(a.DurationMinutes);

                    return appointmentDateTime < existingEnd &&
                           appointmentEndTime > existingStart;
                });

                if (!overlapsAppointment)
                {
                    availableTimes.Add(new AvailableTimeDto
                    {
                        AppointmentDateTime = appointmentDateTime,
                        DisplayTime = appointmentDateTime.ToString("HH:mm"),
                        EndTime = appointmentEndTime.ToString("HH:mm"),
                        DurationMinutes = durationMinutes
                    });
                }

                currentTime = currentTime.Add(TimeSpan.FromMinutes(15));
            }
        }

        return new AvailableTimesResultDto
        {
            Success = true,
            AvailableTimes = availableTimes
        };
    }
}