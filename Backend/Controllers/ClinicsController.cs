using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Backend.Data;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/clinics")]
public class ClinicsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ClinicsController(AppDbContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Clinic>> CreateClinic(Clinic clinic)
    {
        var exists = await _context.Clinics.AnyAsync(c =>
            c.Name.ToLower() == clinic.Name.ToLower()
        );

        if (exists)
        {
            return BadRequest("A clinic with this name already exists.");
        }

        _context.Clinics.Add(clinic);
        await _context.SaveChangesAsync();

        return Ok(clinic);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Clinic>>> GetClinics()
    {
        var clinics = await _context.Clinics.ToListAsync();

        return Ok(clinics);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateClinic(int id, Clinic updatedClinic)
    {
        var clinic = await _context.Clinics.FindAsync(id);

        if (clinic == null)
        {
            return NotFound("Clinic not found.");
        }

        var exists = await _context.Clinics.AnyAsync(c =>
            c.Id != id &&
            c.Name.ToLower() == updatedClinic.Name.ToLower()
        );

        if (exists)
        {
            return BadRequest("A clinic with this name already exists.");
        }

        clinic.Name = updatedClinic.Name;
        clinic.Address = updatedClinic.Address;
        clinic.PostalCode = updatedClinic.PostalCode;
        clinic.City = updatedClinic.City;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteClinic(int id)
    {
        var clinic = await _context.Clinics.FindAsync(id);

        if (clinic == null)
        {
            return NotFound("Clinic not found.");
        }

        var hasDoctors = await _context.Doctors
            .AnyAsync(d => d.ClinicId == id);

        var hasAppointments = await _context.Appointments
            .AnyAsync(a => a.ClinicId == id);

        if (hasDoctors || hasAppointments)
        {
            return Conflict("Cannot delete clinic because it has existing doctors or appointments.");
        }

        _context.Clinics.Remove(clinic);
        await _context.SaveChangesAsync();

        return Ok("Clinic deleted successfully.");
    }
}