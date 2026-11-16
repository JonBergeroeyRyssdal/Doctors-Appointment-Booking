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

    /// <summary>Create a clinic</summary>
    /// <remarks>Send the clinic name and address details as JSON. The name must be unique, ignoring case. Returns the clinic with its generated ID. A duplicate name returns 400. Access: requires a JWT token with the Admin role. Missing or invalid tokens return 401; an incorrect role returns 403.</remarks>
    /// <param name="clinic">JSON containing the fields described above. See the schema under Request body.</param>
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

    /// <summary>Get all clinics</summary>
    /// <remarks>Returns clinic IDs, names and address details. Returns an empty list when no clinics exist. Access: this endpoint does not require authentication in the current implementation.</remarks>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Clinic>>> GetClinics()
    {
        var clinics = await _context.Clinics.ToListAsync();

        return Ok(clinics);
    }

    /// <summary>Update a clinic</summary>
    /// <remarks>Send name, address, postal code and city as JSON. The URL ID selects the clinic. The name must be unique. Returns 204 with no content. An unknown ID returns 404; a duplicate name returns 400. Access: requires a JWT token with the Admin role. Missing or invalid tokens return 401; an incorrect role returns 403.</remarks>
    /// <param name="id">ID of the resource to retrieve, update or delete.</param>
    /// <param name="updatedClinic">JSON containing the fields described above. See the schema under Request body.</param>
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

    /// <summary>Delete a clinic</summary>
    /// <remarks>Deletes the clinic with the specified ID and returns a confirmation message. An unknown ID returns 404. Clinics with associated doctors or appointments cannot be deleted and return 409. Access: requires a JWT token with the Admin role. Missing or invalid tokens return 401; an incorrect role returns 403.</remarks>
    /// <param name="id">ID of the resource to retrieve, update or delete.</param>
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