using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Backend.Data;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/specialities")]
public class SpecialityController : ControllerBase
{
    private readonly AppDbContext _context;

    public SpecialityController(AppDbContext context)
    {
        _context = context;
    }

    // POST: api/specialities
    /// <summary>Create a medical speciality</summary>
    /// <remarks>Send the speciality name as JSON. The name must be unique, ignoring case. Returns the created speciality with its ID. A duplicate name returns 400. Access: requires a JWT token with the Admin role. Missing or invalid tokens return 401; an incorrect role returns 403.</remarks>
    /// <param name="speciality">JSON containing the fields described above. See the schema under Request body.</param>
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Speciality>> CreateSpeciality(Speciality speciality)
    {
        var exists = await _context.Specialities.AnyAsync(s =>
            s.Name.ToLower() == speciality.Name.ToLower()
        );

        if (exists)
        {
            return BadRequest("A speciality with this name already exists.");
        }

        _context.Specialities.Add(speciality);
        await _context.SaveChangesAsync();

        return Ok(speciality);
    }

    // GET: api/specialities
    /// <summary>Get all medical specialities</summary>
    /// <remarks>Returns IDs and names for the specialities available when selecting a doctor and booking an appointment. Returns an empty list when no specialities exist. Access: this endpoint does not require authentication in the current implementation.</remarks>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<Speciality>>> GetSpecialities()
    {
        var specialities = await _context.Specialities.ToListAsync();

        return Ok(specialities);
    }

    // DELETE: api/specialities/1
    /// <summary>Delete a medical speciality</summary>
    /// <remarks>Deletes the speciality with the specified ID and returns 204 with no content. An unknown ID returns 404. Associated doctors or appointments prevent deletion and return 409. Access: requires a JWT token with the Admin role. Missing or invalid tokens return 401; an incorrect role returns 403.</remarks>
    /// <param name="id">ID of the resource to retrieve, update or delete.</param>
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSpeciality(int id)
    {
        var speciality = await _context.Specialities.FindAsync(id);

        if (speciality == null)
        {
            return NotFound("Speciality not found.");
        }

        var hasDoctors = await _context.Doctors
            .AnyAsync(d => d.SpecialityId == id);

        var hasAppointments = await _context.Appointments
            .AnyAsync(a => a.SpecialityId == id);

        if (hasDoctors || hasAppointments)
        {
            return Conflict(new
            {
                message = "Cannot delete speciality because existing doctors or appointments depend on it."
            });
        }

        _context.Specialities.Remove(speciality);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}