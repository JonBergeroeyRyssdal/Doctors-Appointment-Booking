using Backend.Dtos.Admin;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers.Admin;

[ApiController]
[Route("api/admin/auth")]
public class AdminAuthController : ControllerBase
{
    private readonly AdminAuthService _adminAuthService;

    public AdminAuthController(AdminAuthService adminAuthService)
    {
        _adminAuthService = adminAuthService;
    }

    /// <summary>Sign in as an administrator</summary>
    /// <remarks>Send username and password as JSON. Returns a JWT token, username and the Admin role. Use the token in Authorize to access administrator features. Invalid credentials return 401. Access: this endpoint does not require authentication in the current implementation.</remarks>
    /// <param name="dto">JSON containing the fields described above. See the schema under Request body.</param>
    [HttpPost("login")]
    public async Task<IActionResult> Login(AdminLoginDto dto)
    {
        var token = await _adminAuthService.Login(dto);

        if (token == null)
        {
            return Unauthorized("Invalid admin credentials.");
        }

        return Ok(new
        {
            token,
            username = dto.Username,
            role = "Admin"
        });
    }
}