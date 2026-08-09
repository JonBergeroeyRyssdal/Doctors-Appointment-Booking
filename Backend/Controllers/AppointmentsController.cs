using System.Security.Claims;
using Backend.Data;
using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly AppointmentService _appointmentService;

    public AppointmentsController(
        AppDbContext context,
        AppointmentService appointmentService
    )
    {
        _context = context;
        _appointmentService = appointmentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAppointments()
    {
        var appointments = await _context.Appointments
            .Include(a => a.Patient)
            .Include(a => a.Clinic)
            .Include(a => a.Doctor)
            .Include(a => a.Speciality)
            .Select(a => new AppointmentDto
            {
                Id = a.Id,
                AppointmentDateTime = a.AppointmentDateTime,
                DurationMinutes = a.DurationMinutes,
                EndDateTime = a.AppointmentDateTime.AddMinutes(a.DurationMinutes),
                DisplayTime = a.AppointmentDateTime.ToString("HH:mm"),
                EndTime = a.AppointmentDateTime.AddMinutes(a.DurationMinutes).ToString("HH:mm"),
                Status = a.Status,
                MessageToDoctor = a.MessageToDoctor,

                PatientId = a.PatientId,
                PatientName = a.Patient != null
                    ? a.Patient.FirstName + " " + a.Patient.LastName
                    : null,

                ClinicId = a.ClinicId,
                ClinicName = a.Clinic != null ? a.Clinic.Name : null,

                DoctorId = a.DoctorId,
                DoctorName = a.Doctor != null
                    ? a.Doctor.FirstName + " " + a.Doctor.LastName
                    : null,
                DoctorFirstName = a.Doctor != null ? a.Doctor.FirstName : null,
                DoctorLastName = a.Doctor != null ? a.Doctor.LastName : null,

                SpecialityId = a.SpecialityId,
                SpecialityName = a.Speciality != null ? a.Speciality.Name : null
            })
            .ToListAsync();

        return Ok(appointments);
    }

    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyAppointments()
    {
        var patientId = GetPatientIdFromToken();

        if (patientId == null)
        {
            return Unauthorized(new { message = "Patient id not found in token." });
        }

        var appointments = await _context.Appointments
            .Where(a => a.PatientId == patientId)
            .Include(a => a.Clinic)
            .Include(a => a.Doctor)
            .Include(a => a.Speciality)
            .Select(a => new AppointmentDto
            {
                Id = a.Id,
                AppointmentDateTime = a.AppointmentDateTime,
                DurationMinutes = a.DurationMinutes,
                EndDateTime = a.AppointmentDateTime.AddMinutes(a.DurationMinutes),
                DisplayTime = a.AppointmentDateTime.ToString("HH:mm"),
                EndTime = a.AppointmentDateTime.AddMinutes(a.DurationMinutes).ToString("HH:mm"),
                Status = a.Status,
                MessageToDoctor = a.MessageToDoctor,

                PatientId = a.PatientId,

                ClinicId = a.ClinicId,
                ClinicName = a.Clinic != null ? a.Clinic.Name : null,

                DoctorId = a.DoctorId,
                DoctorName = a.Doctor != null
                    ? a.Doctor.FirstName + " " + a.Doctor.LastName
                    : null,
                DoctorFirstName = a.Doctor != null ? a.Doctor.FirstName : null,
                DoctorLastName = a.Doctor != null ? a.Doctor.LastName : null,

                SpecialityId = a.SpecialityId,
                SpecialityName = a.Speciality != null ? a.Speciality.Name : null
            })
            .ToListAsync();

        return Ok(appointments);
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAppointmentById(int id)
    {
        var patientId = GetPatientIdFromToken();

        if (patientId == null)
        {
            return Unauthorized(new { message = "Patient id not found in token." });
        }

        var appointment = await _context.Appointments
            .Where(a => a.Id == id && a.PatientId == patientId)
            .Include(a => a.Clinic)
            .Include(a => a.Doctor)
            .Include(a => a.Speciality)
            .Select(a => new AppointmentDto
            {
                Id = a.Id,
                AppointmentDateTime = a.AppointmentDateTime,
                DurationMinutes = a.DurationMinutes,
                EndDateTime = a.AppointmentDateTime.AddMinutes(a.DurationMinutes),
                DisplayTime = a.AppointmentDateTime.ToString("HH:mm"),
                EndTime = a.AppointmentDateTime.AddMinutes(a.DurationMinutes).ToString("HH:mm"),
                Status = a.Status,
                MessageToDoctor = a.MessageToDoctor,

                PatientId = a.PatientId,

                ClinicId = a.ClinicId,
                ClinicName = a.Clinic != null ? a.Clinic.Name : null,

                DoctorId = a.DoctorId,
                DoctorName = a.Doctor != null
                    ? a.Doctor.FirstName + " " + a.Doctor.LastName
                    : null,
                DoctorFirstName = a.Doctor != null ? a.Doctor.FirstName : null,
                DoctorLastName = a.Doctor != null ? a.Doctor.LastName : null,

                SpecialityId = a.SpecialityId,
                SpecialityName = a.Speciality != null ? a.Speciality.Name : null
            })
            .FirstOrDefaultAsync();

        if (appointment == null)
        {
            return NotFound(new { message = "Appointment not found." });
        }

        return Ok(appointment);
    }

    [HttpPost]
    public async Task<IActionResult> CreateGuestAppointment(
        CreatePatientAppointmentDto dto
    )
    {
        var result = await _appointmentService
            .CreateGuestAppointmentAsync(dto);

        return ToActionResult(result);
    }

    [Authorize]
    [HttpPost("patient")]
    public async Task<IActionResult> CreateLoggedInPatientAppointment(
        CreatePatientAppointmentDto dto
    )
    {
        var patientId = GetPatientIdFromToken();

        if (patientId == null)
        {
            return Unauthorized(new { message = "Patient id not found in token." });
        }

        var result = await _appointmentService
            .CreateLoggedInPatientAppointmentAsync(dto, patientId.Value);

        return ToActionResult(result);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAppointment(
        int id,
        UpdateAppointmentDto dto
    )
    {
        var patientId = GetPatientIdFromToken();

        if (patientId == null)
        {
            return Unauthorized(new { message = "Patient id not found in token." });
        }

        var result = await _appointmentService
            .UpdateAppointmentAsync(id, dto, patientId.Value);

        return ToActionResult(result);
    }

    [Authorize]
    [HttpPut("{id}/cancel")]
    public async Task<IActionResult> CancelAppointment(int id)
    {
        var patientId = GetPatientIdFromToken();

        if (patientId == null)
        {
            return Unauthorized(new { message = "Patient id not found in token." });
        }

        var result = await _appointmentService
            .CancelAppointmentAsync(id, patientId.Value);

        return ToActionResult(result);
    }

    private int? GetPatientIdFromToken()
    {
        var patientIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (patientIdClaim == null)
        {
            return null;
        }

        return int.Parse(patientIdClaim);
    }

    private IActionResult ToActionResult(AppointmentServiceResult result)
    {
        if (result.Success)
        {
            return Ok(result.Data);
        }

        if (result.StatusCode == 404)
        {
            return NotFound(new { message = result.Message });
        }

        return BadRequest(new { message = result.Message });
    }
}