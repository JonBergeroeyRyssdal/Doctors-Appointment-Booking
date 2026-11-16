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
    /// <summary>Get all doctors</summary>
    /// <remarks>Returns doctor IDs, names, clinics, specialities and weekly working hours. Working hours include the weekday and start and end times in HH:mm format. Access: this endpoint does not require authentication in the current implementation.</remarks>
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
    /// <summary>Search doctors by name</summary>
    /// <remarks>Searches for text contained in a doctor's first or last name. Returns matching IDs, names, clinics and specialities. No matches return an empty list. An empty search term returns 400. Access: this endpoint does not require authentication in the current implementation.</remarks>
    /// <param name="name">All or part of the doctor's first or last name, for example Hansen.</param>
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
    /// <summary>Get a doctor</summary>
    /// <remarks>Returns the name, clinic, speciality and weekly working hours of the doctor with the specified ID. An unknown ID returns 404. Access: this endpoint does not require authentication in the current implementation.</remarks>
    /// <param name="id">ID of the resource to retrieve, update or delete.</param>
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

    /// <summary>Create a doctor</summary>
    /// <remarks>Send first name, last name, clinic ID and speciality ID as JSON. The clinic and speciality must exist. Returns 201 with the doctor and a Location header. An unknown clinic or speciality returns 400. Access: requires a JWT token with the Admin role. Missing or invalid tokens return 401; an incorrect role returns 403.</remarks>
    /// <param name="doctor">JSON containing the fields described above. See the schema under Request body.</param>
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

    /// <summary>Update a doctor</summary>
    /// <remarks>Send first name, last name, clinic ID and speciality ID as JSON. The URL ID selects the doctor. Returns 204 with no content. An unknown doctor returns 404; an unknown clinic or speciality returns 400. Access: requires a JWT token with the Admin role. Missing or invalid tokens return 401; an incorrect role returns 403.</remarks>
    /// <param name="id">ID of the resource to retrieve, update or delete.</param>
    /// <param name="updatedDoctor">JSON containing the fields described above. See the schema under Request body.</param>
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

    /// <summary>Delete a doctor</summary>
    /// <remarks>Deletes the doctor and their working-hour records and returns a confirmation message. An unknown doctor returns 404. Doctors with existing appointments cannot be deleted and return 409. Access: requires a JWT token with the Admin role. Missing or invalid tokens return 401; an incorrect role returns 403.</remarks>
    /// <param name="id">ID of the resource to retrieve, update or delete.</param>
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