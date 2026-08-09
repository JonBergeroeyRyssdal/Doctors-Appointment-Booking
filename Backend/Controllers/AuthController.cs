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
