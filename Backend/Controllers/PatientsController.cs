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
    /// <summary>Get my patient profile</summary>
    /// <remarks>Uses the patient ID from the token. Returns profile details without the password hash. A missing identity returns 401; an unknown patient returns 404. Access: requires a valid JWT token. Use patient sign-in for patient features. Missing or invalid tokens return 401.</remarks>
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
    /// <summary>Get all patients</summary>
    /// <remarks>Returns patient IDs, names, emails, birthdates, genders and roles. Password hashes are not returned. Access: this endpoint does not require authentication in the current implementation.</remarks>
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
    /// <summary>Get a patient profile</summary>
    /// <remarks>Returns profile details for the specified patient, including recorded identity and insurance information. The password hash is not returned. An unknown ID returns 404. Access: this endpoint does not require authentication in the current implementation.</remarks>
    /// <param name="id">ID of the resource to retrieve, update or delete.</param>
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
    /// <summary>Register a patient account</summary>
    /// <remarks>Send name, email, password and optional profile details as JSON. Email is trimmed and stored in lowercase. A guest with the same email is upgraded to Patient and returned with 200. A new account returns 201 with the profile and a Location header. An already registered patient with the same email returns 400. Access: this endpoint does not require authentication in the current implementation.</remarks>
    /// <param name="dto">JSON containing the fields described above. See the schema under Request body.</param>
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
    /// <summary>Update a patient profile</summary>
    /// <remarks>Send the patient ID and profile fields as JSON. The body ID must match the URL ID. Updates profile details; password and role remain unchanged. Returns 204 with no content. An ID mismatch or duplicate email returns 400; an unknown patient returns 404. Access: this endpoint does not require authentication in the current implementation.</remarks>
    /// <param name="id">ID of the resource to retrieve, update or delete.</param>
    /// <param name="updatedPatient">JSON containing the fields described above. See the schema under Request body.</param>
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
    /// <summary>Delete a patient</summary>
    /// <remarks>Deletes the patient with the specified ID. Returns 204 with no content. An unknown ID returns 404. Patients with existing appointments cannot be deleted and return 409. Access: this endpoint does not require authentication in the current implementation.</remarks>
    /// <param name="id">ID of the resource to retrieve, update or delete.</param>
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

