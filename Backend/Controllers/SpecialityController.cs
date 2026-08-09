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
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<Speciality>>> GetSpecialities()
    {
        var specialities = await _context.Specialities.ToListAsync();

        return Ok(specialities);
    }

    // DELETE: api/specialities/1
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