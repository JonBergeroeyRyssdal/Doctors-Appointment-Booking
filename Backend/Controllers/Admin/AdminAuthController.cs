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