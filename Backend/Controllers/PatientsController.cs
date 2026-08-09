using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

using Backend.Data;
using Backend.Models;
using Backend.Dtos;

namespace Backend.Controllers;

[ApiController]
[Route("api/patients")]
public class PatientsController : ControllerBase
{
    private readonly AppDbContext _context;

    public PatientsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/patients/me
    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var patientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (patientIdClaim == null)
        {
            return Unauthorized();
        }

        int patientId = int.Parse(patientIdClaim.Value);

        var patient = await _context.Patients
            .Where(p => p.Id == patientId)
            .Select(p => new PatientDto
            {
                Id = p.Id,
                FirstName = p.FirstName,
                LastName = p.LastName,
                Email = p.Email,
                Birthdate = p.Birthdate,
                Gender = p.Gender,
                Role = p.Role,
                SocialSecurityNumber = p.SocialSecurityNumber,
                TaxNumber = p.TaxNumber,
                Religion = p.Religion,
                DriversLicenseNumber = p.DriversLicenseNumber,
                MedicalInsuranceMemberNumber =
                    p.MedicalInsuranceMemberNumber
            })
            .FirstOrDefaultAsync();

        if (patient == null)
        {
            return NotFound();
        }

        return Ok(patient);
    }

    // GET: api/patients
    [HttpGet]
    public async Task<IActionResult> GetPatients()
    {
        var patients = await _context.Patients
            .Select(p => new PatientDto
            {
                Id = p.Id,
                FirstName = p.FirstName,
                LastName = p.LastName,
                Email = p.Email,
                Birthdate = p.Birthdate,
                Gender = p.Gender,
                Role = p.Role
            })
            .ToListAsync();

        return Ok(patients);
    }

    // GET: api/patients/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetPatient(int id)
    {
        var patient = await _context.Patients
            .Where(p => p.Id == id)
            .Select(p => new PatientDto
            {
                Id = p.Id,
                FirstName = p.FirstName,
                LastName = p.LastName,
                Email = p.Email,
                Birthdate = p.Birthdate,
                Gender = p.Gender,
                Role = p.Role,
                SocialSecurityNumber = p.SocialSecurityNumber,
                TaxNumber = p.TaxNumber,
                Religion = p.Religion,
                DriversLicenseNumber = p.DriversLicenseNumber,
                MedicalInsuranceMemberNumber =
                    p.MedicalInsuranceMemberNumber
            })
            .FirstOrDefaultAsync();

        if (patient == null)
        {
            return NotFound();
        }

        return Ok(patient);
    }

    // POST: api/patients
    [HttpPost]
    public async Task<ActionResult<PatientDto>> CreatePatient(
        CreatePatientDto dto
    )
    {
        var email = dto.Email.Trim().ToLower();

        var existingPatient = await _context.Patients
            .FirstOrDefaultAsync(p => p.Email.ToLower() == email);

        if (existingPatient != null)
        {
            if (existingPatient.Role == "Patient")
            {
                return BadRequest(new
                {
                    message =
                        "A registered patient with this email already exists."
                });
            }

            existingPatient.FirstName = dto.FirstName;
            existingPatient.LastName = dto.LastName;
            existingPatient.Email = email;
            existingPatient.Birthdate = dto.Birthdate;
            existingPatient.Gender = dto.Gender;
            existingPatient.SocialSecurityNumber =
                dto.SocialSecurityNumber;
            existingPatient.TaxNumber = dto.TaxNumber;
            existingPatient.Religion = dto.Religion;
            existingPatient.DriversLicenseNumber =
                dto.DriversLicenseNumber;
            existingPatient.MedicalInsuranceMemberNumber =
                dto.MedicalInsuranceMemberNumber;
            existingPatient.Role = "Patient";
            existingPatient.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(dto.Password);

            await _context.SaveChangesAsync();

            var existingPatientDto = new PatientDto
            {
                Id = existingPatient.Id,
                FirstName = existingPatient.FirstName,
                LastName = existingPatient.LastName,
                Email = existingPatient.Email,
                Birthdate = existingPatient.Birthdate,
                Gender = existingPatient.Gender,
                Role = existingPatient.Role,
                SocialSecurityNumber =
                    existingPatient.SocialSecurityNumber,
                TaxNumber = existingPatient.TaxNumber,
                Religion = existingPatient.Religion,
                DriversLicenseNumber =
                    existingPatient.DriversLicenseNumber,
                MedicalInsuranceMemberNumber =
                    existingPatient.MedicalInsuranceMemberNumber
            };

            return Ok(existingPatientDto);
        }

        var patient = new Patient
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = email,
            Birthdate = dto.Birthdate,
            Gender = dto.Gender,
            SocialSecurityNumber = dto.SocialSecurityNumber,
            TaxNumber = dto.TaxNumber,
            Religion = dto.Religion,
            DriversLicenseNumber = dto.DriversLicenseNumber,
            MedicalInsuranceMemberNumber =
                dto.MedicalInsuranceMemberNumber,
            Role = "Patient",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();

        var patientDto = new PatientDto
        {
            Id = patient.Id,
            FirstName = patient.FirstName,
            LastName = patient.LastName,
            Email = patient.Email,
            Birthdate = patient.Birthdate,
            Gender = patient.Gender,
            Role = patient.Role,
            SocialSecurityNumber = patient.SocialSecurityNumber,
            TaxNumber = patient.TaxNumber,
            Religion = patient.Religion,
            DriversLicenseNumber = patient.DriversLicenseNumber,
            MedicalInsuranceMemberNumber =
                patient.MedicalInsuranceMemberNumber
        };

        return CreatedAtAction(
            nameof(GetPatient),
            new { id = patient.Id },
            patientDto
        );
    }

    // PUT: api/patients/1
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePatient(
        int id,
        Patient updatedPatient
    )
    {
        if (id != updatedPatient.Id)
        {
            return BadRequest("Patient id does not match.");
        }

        var patient = await _context.Patients.FindAsync(id);

        if (patient == null)
        {
            return NotFound("Patient not found.");
        }

        var email = updatedPatient.Email.Trim().ToLower();

        var emailExists = await _context.Patients.AnyAsync(p =>
            p.Id != id &&
            p.Email.ToLower() == email
        );

        if (emailExists)
        {
            return BadRequest("A patient with this email already exists.");
        }

        patient.FirstName = updatedPatient.FirstName;
        patient.LastName = updatedPatient.LastName;
        patient.Email = email;
        patient.Birthdate = updatedPatient.Birthdate;
        patient.Gender = updatedPatient.Gender;
        patient.SocialSecurityNumber =
            updatedPatient.SocialSecurityNumber;
        patient.TaxNumber = updatedPatient.TaxNumber;
        patient.Religion = updatedPatient.Religion;
        patient.DriversLicenseNumber =
            updatedPatient.DriversLicenseNumber;
        patient.MedicalInsuranceMemberNumber =
            updatedPatient.MedicalInsuranceMemberNumber;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/patients/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePatient(int id)
    {
        var patient = await _context.Patients.FindAsync(id);

        if (patient == null)
        {
            return NotFound("Patient not found.");
        }

        var hasAppointments = await _context.Appointments
            .AnyAsync(a => a.PatientId == id);

        if (hasAppointments)
        {
            return Conflict(new
            {
                message =
                    "Cannot delete patient because existing appointments depend on this patient."
            });
        }

        _context.Patients.Remove(patient);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

