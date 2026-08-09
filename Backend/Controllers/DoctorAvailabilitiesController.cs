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