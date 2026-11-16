using Backend.Dtos;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    /// <summary>Sign in as a patient</summary>
    /// <remarks>Send email and password as JSON. Returns a JWT token and the patient's ID, name, email and role. Use the token in Authorize to access patient features. Invalid credentials return 401. Access: this endpoint does not require authentication in the current implementation.</remarks>
    /// <param name="dto">JSON containing the fields described above. See the schema under Request body.</param>
    [HttpPost("patient-login")]
    public async Task<IActionResult> PatientLogin(PatientLoginDto dto)
    {
        var result = await _authService.PatientLogin(dto);

        if (!result.Success)
        {
            return Unauthorized(new
            {
                message = result.Message
            });
        }

        return Ok(new
        {
            token = result.Token,

            patient = new
            {
                result.Patient!.Id,
                result.Patient.FirstName,
                result.Patient.LastName,
                result.Patient.Email,
                result.Patient.Role
            }
        });
    }
}
