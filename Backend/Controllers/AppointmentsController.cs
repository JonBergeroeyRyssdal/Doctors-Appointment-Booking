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

    /// <summary>Get all appointments</summary>
    /// <remarks>Returns appointment times, durations, statuses, patients, clinics, doctors and specialities. Includes cancelled appointments. Access: this endpoint does not require authentication in the current implementation.</remarks>
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

    /// <summary>Get my appointments</summary>
    /// <remarks>Uses the patient ID from the token. Returns all appointments belonging to the signed-in patient, including cancelled appointments. Access: requires a valid JWT token. Use patient sign-in for patient features. Missing or invalid tokens return 401.</remarks>
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

    /// <summary>Get one of my appointments</summary>
    /// <remarks>Returns appointment details only if the appointment belongs to the signed-in patient. Returns 404 if it does not exist or belongs to another patient. Access: requires a valid JWT token. Use patient sign-in for patient features. Missing or invalid tokens return 401.</remarks>
    /// <param name="id">ID of the resource to retrieve, update or delete.</param>
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

    /// <summary>Book an appointment as a guest</summary>
    /// <remarks>Send first name, last name and email along with clinic ID, speciality ID, doctor ID, start time and duration. Birthdate and message are optional. An existing patient with the same email is reused. Returns the appointment with status Booked. Access: this endpoint does not require authentication in the current implementation. Booking rules: duration must be 15, 30, 45 or 60 minutes; start times must fall on a 15-minute interval, between now and two months ahead. The entire appointment must fit within working hours and outside lunch from 11:30 to 12:30. Neither the doctor nor the patient may have overlapping active appointments. Invalid booking data returns 400.</remarks>
    /// <param name="dto">JSON containing the fields described above. See the schema under Request body.</param>
    [HttpPost]
    public async Task<IActionResult> CreateGuestAppointment(
        CreatePatientAppointmentDto dto
    )
    {
        var result = await _appointmentService
            .CreateGuestAppointmentAsync(dto);

        return ToActionResult(result);
    }

    /// <summary>Book an appointment as a signed-in patient</summary>
    /// <remarks>Uses the patient ID from the token. Send clinic ID, speciality ID, doctor ID, start time, duration and an optional message. Guest profile fields are ignored. Returns the appointment with status Booked. Access: requires a valid JWT token. Use patient sign-in for patient features. Missing or invalid tokens return 401. Booking rules: duration must be 15, 30, 45 or 60 minutes; start times must fall on a 15-minute interval, between now and two months ahead. The entire appointment must fit within working hours and outside lunch from 11:30 to 12:30. Neither the doctor nor the patient may have overlapping active appointments. Invalid booking data returns 400.</remarks>
    /// <param name="dto">JSON containing the fields described above. See the schema under Request body.</param>
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

    /// <summary>Update one of my appointments</summary>
    /// <remarks>Send all appointment fields as JSON. Only the patient's own appointments can be updated. Cancelled appointments and appointments starting in less than 24 hours cannot be updated. Returns the updated appointment. Returns 404 if the appointment does not exist for this patient. Access: requires a valid JWT token. Use patient sign-in for patient features. Missing or invalid tokens return 401. Booking rules: duration must be 15, 30, 45 or 60 minutes; start times must fall on a 15-minute interval, between now and two months ahead. The entire appointment must fit within working hours and outside lunch from 11:30 to 12:30. Neither the doctor nor the patient may have overlapping active appointments. Invalid booking data returns 400.</remarks>
    /// <param name="id">ID of the resource to retrieve, update or delete.</param>
    /// <param name="dto">JSON containing the fields described above. See the schema under Request body.</param>
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

    /// <summary>Cancel one of my appointments</summary>
    /// <remarks>Sets the status to Cancelled and keeps the appointment in the database. No request body is needed. Only the patient's own appointments can be cancelled, with at least 24 hours remaining before the start. Returns a confirmation message. Already cancelled appointments return 400. Access: requires a valid JWT token. Use patient sign-in for patient features. Missing or invalid tokens return 401.</remarks>
    /// <param name="id">ID of the resource to retrieve, update or delete.</param>
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