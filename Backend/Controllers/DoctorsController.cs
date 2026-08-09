using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Backend.Data;

namespace Backend.Controllers;

using Microsoft.AspNetCore.Authorization;
using Backend.Models;

[ApiController]
[Route("api/[controller]")]
public class DoctorsController : ControllerBase
{
    private readonly AppDbContext _context;

    public DoctorsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/doctors
    [HttpGet]
    public async Task<IActionResult> GetDoctors()
    {
        var doctors = await _context.Doctors
            .Include(d => d.Clinic)
            .Include(d => d.Speciality)
            .Include(d => d.Availabilities)
            .Select(d => new
            {
                id = d.Id,
                firstName = d.FirstName,
                lastName = d.LastName,

                clinicId = d.ClinicId,
                clinicName = d.Clinic != null
                    ? d.Clinic.Name
                    : null,

                specialityId = d.SpecialityId,
                specialityName = d.Speciality != null
                    ? d.Speciality.Name
                    : null,

                availabilities = d.Availabilities.Select(a => new
                {
                    id = a.Id,
                    dayOfWeek = a.DayOfWeek.ToString(),
                    startTime = a.StartTime.ToString(@"hh\:mm"),
                    endTime = a.EndTime.ToString(@"hh\:mm")
                })
            })
            .ToListAsync();

        return Ok(doctors);
    }

    // GET: api/doctors/search?name=smith
    [HttpGet("search")]
    public async Task<IActionResult> SearchDoctors([FromQuery] string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            return BadRequest("Search name is required.");
        }

        var doctors = await _context.Doctors
            .Include(d => d.Clinic)
            .Include(d => d.Speciality)
            .Where(d =>
                d.FirstName.Contains(name) ||
                d.LastName.Contains(name)
            )
            .Select(d => new
            {
                id = d.Id,
                firstName = d.FirstName,
                lastName = d.LastName,
                clinicName = d.Clinic != null ? d.Clinic.Name : null,
                specialityName = d.Speciality != null ? d.Speciality.Name : null
            })
            .ToListAsync();

        return Ok(doctors);
    }

    // GET: api/doctors/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetDoctor(int id)
    {
        var doctor = await _context.Doctors
            .Include(d => d.Clinic)
            .Include(d => d.Speciality)
            .Include(d => d.Availabilities)
            .Where(d => d.Id == id)
            .Select(d => new
            {
                id = d.Id,
                firstName = d.FirstName,
                lastName = d.LastName,

                clinicId = d.ClinicId,
                clinicName = d.Clinic != null
                    ? d.Clinic.Name
                    : null,

                specialityId = d.SpecialityId,
                specialityName = d.Speciality != null
                    ? d.Speciality.Name
                    : null,

                availabilities = d.Availabilities.Select(a => new
                {
                    id = a.Id,
                    dayOfWeek = a.DayOfWeek.ToString(),
                    startTime = a.StartTime.ToString(@"hh\:mm"),
                    endTime = a.EndTime.ToString(@"hh\:mm")
                })
            })
            .FirstOrDefaultAsync();

        if (doctor == null)
        {
            return NotFound();
        }

        return Ok(doctor);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateDoctor(Doctor doctor)
    {
        var clinicExists = await _context.Clinics.AnyAsync(c => c.Id == doctor.ClinicId);
        var specialityExists = await _context.Specialities.AnyAsync(s => s.Id == doctor.SpecialityId);

        if (!clinicExists)
        {
            return BadRequest("Clinic does not exist.");
        }

        if (!specialityExists)
        {
            return BadRequest("Speciality does not exist.");
        }

        _context.Doctors.Add(doctor);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetDoctor), new { id = doctor.Id }, doctor);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDoctor(int id, Doctor updatedDoctor)
    {
        var doctor = await _context.Doctors.FindAsync(id);

        if (doctor == null)
        {
            return NotFound("Doctor not found.");
        }

        var clinicExists = await _context.Clinics
            .AnyAsync(c => c.Id == updatedDoctor.ClinicId);

        if (!clinicExists)
        {
            return BadRequest("Clinic does not exist.");
        }

        var specialityExists = await _context.Specialities
            .AnyAsync(s => s.Id == updatedDoctor.SpecialityId);

        if (!specialityExists)
        {
            return BadRequest("Speciality does not exist.");
        }

        doctor.FirstName = updatedDoctor.FirstName;
        doctor.LastName = updatedDoctor.LastName;
        doctor.ClinicId = updatedDoctor.ClinicId;
        doctor.SpecialityId = updatedDoctor.SpecialityId;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDoctor(int id)
    {
        var doctor = await _context.Doctors.FindAsync(id);

        if (doctor == null)
        {
            return NotFound("Doctor not found.");
        }

        var hasAppointments = await _context.Appointments
            .AnyAsync(a => a.DoctorId == id);

        if (hasAppointments)
        {
            return Conflict("Cannot delete doctor because the doctor has existing appointments.");
        }

        var availabilities = await _context.DoctorAvailabilities
            .Where(a => a.DoctorId == id)
            .ToListAsync();

        _context.DoctorAvailabilities.RemoveRange(availabilities);
        _context.Doctors.Remove(doctor);

        await _context.SaveChangesAsync();

        return Ok("Doctor deleted successfully.");
    }
}