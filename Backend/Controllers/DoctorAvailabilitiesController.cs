using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Backend.Data;
using Backend.Services;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DoctorAvailabilitiesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly AvailabilityService _availabilityService;

    public DoctorAvailabilitiesController(
        AppDbContext context,
        AvailabilityService availabilityService)
    {
        _context = context;
        _availabilityService = availabilityService;
    }

    // GET: api/doctoravailabilities/available-times?doctorId=1&date=2026-05-24&durationMinutes=30
    /// <summary>Find available appointment start times</summary>
    /// <remarks>Provide doctor ID, date and duration as query parameters. Returns start time, display time, end time and duration at 15-minute intervals within the doctor's working hours, excluding overlaps with active appointments. No available times return an empty list. An unknown doctor returns 404; an invalid duration returns 400. This calculation does not exclude past times, lunch breaks or dates more than two months ahead; booking validates those rules separately. Access: this endpoint does not require authentication in the current implementation.</remarks>
    /// <param name="doctorId">ID of the doctor.</param>
    /// <param name="date">Date in YYYY-MM-DD format, for example 2026-12-01. Only the date component is used.</param>
    /// <param name="durationMinutes">Requested duration in minutes: 15, 30, 45 or 60.</param>
    [HttpGet("available-times")]
    public async Task<IActionResult> GetAvailableTimes(
        int doctorId,
        DateTime date,
        int durationMinutes)
    {
        var result = await _availabilityService.GetAvailableTimes(
            doctorId,
            date,
            durationMinutes
        );

        if (!result.Success)
        {
            if (result.Message == "Doctor not found.")
            {
                return NotFound(result.Message);
            }

            return BadRequest(result.Message);
        }

        return Ok(result.AvailableTimes);
    }

    // GET: api/doctoravailabilities
    /// <summary>Get all weekly working-hour windows</summary>
    /// <remarks>Returns working-hour windows for all doctors with ID, doctor ID, doctor name, weekday and times in HH:mm format. These are recurring working hours rather than available appointment slots. Access: this endpoint does not require authentication in the current implementation.</remarks>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var availabilities = await _context.DoctorAvailabilities
            .Include(a => a.Doctor)
            .Select(a => new
            {
                id = a.Id,
                doctorId = a.DoctorId,
                doctorName = a.Doctor != null
                    ? a.Doctor.FirstName + " " + a.Doctor.LastName
                    : null,
                dayOfWeek = a.DayOfWeek.ToString(),
                startTime = a.StartTime.ToString(@"hh\:mm"),
                endTime = a.EndTime.ToString(@"hh\:mm")
            })
            .ToListAsync();

        return Ok(availabilities);
    }

    // GET: api/doctoravailabilities/doctor/1
    /// <summary>Get a doctor's weekly working hours</summary>
    /// <remarks>Returns the doctor's working-hour windows with ID, doctor ID, weekday and times in HH:mm format. No recorded windows or an unknown doctor return an empty list. Access: this endpoint does not require authentication in the current implementation.</remarks>
    /// <param name="doctorId">ID of the doctor.</param>
    [HttpGet("doctor/{doctorId}")]
    public async Task<IActionResult> GetByDoctor(int doctorId)
    {
        var availabilities = await _context.DoctorAvailabilities
            .Where(a => a.DoctorId == doctorId)
            .Select(a => new
            {
                id = a.Id,
                doctorId = a.DoctorId,
                dayOfWeek = a.DayOfWeek.ToString(),
                startTime = a.StartTime.ToString(@"hh\:mm"),
                endTime = a.EndTime.ToString(@"hh\:mm")
            })
            .ToListAsync();

        return Ok(availabilities);
    }

    // GET: api/doctoravailabilities/1
    /// <summary>Get a working-hour window</summary>
    /// <remarks>Returns the window ID, doctor ID, doctor name, weekday and start and end times in HH:mm format. The ID identifies the working-hour window. An unknown ID returns 404. Access: this endpoint does not require authentication in the current implementation.</remarks>
    /// <param name="id">ID of the resource to retrieve, update or delete.</param>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var availability = await _context.DoctorAvailabilities
            .Include(a => a.Doctor)
            .Where(a => a.Id == id)
            .Select(a => new
            {
                id = a.Id,
                doctorId = a.DoctorId,
                doctorName = a.Doctor != null
                    ? a.Doctor.FirstName + " " + a.Doctor.LastName
                    : null,
                dayOfWeek = a.DayOfWeek.ToString(),
                startTime = a.StartTime.ToString(@"hh\:mm"),
                endTime = a.EndTime.ToString(@"hh\:mm")
            })
            .FirstOrDefaultAsync();

        if (availability == null)
        {
            return NotFound();
        }

        return Ok(availability);
    }
}