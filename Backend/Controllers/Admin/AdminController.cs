using Backend.Data;
using Backend.Dtos.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

using AdminModel = Backend.Models.Admin;

namespace Backend.Controllers.Admin;

[ApiController]
[Route("api/admins")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/admins
    /// <summary>Get all administrators</summary>
    /// <remarks>Returns administrator IDs and usernames. Password hashes are not returned. Access: requires a JWT token with the Admin role. Missing or invalid tokens return 401; an incorrect role returns 403.</remarks>
    [HttpGet]
    public async Task<IActionResult> GetAdmins()
    {
        var admins = await _context.Admins
            .Select(a => new AdminDto
            {
                Id = a.Id,
                Username = a.Username
            })
            .ToListAsync();

        return Ok(admins);
    }

    // GET: api/admins/1
    /// <summary>Get an administrator</summary>
    /// <remarks>Returns the ID and username of the administrator with the specified ID. The password hash is not returned. An unknown ID returns 404. Access: requires a JWT token with the Admin role. Missing or invalid tokens return 401; an incorrect role returns 403.</remarks>
    /// <param name="id">ID of the resource to retrieve, update or delete.</param>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAdmin(int id)
    {
        var admin = await _context.Admins
            .Where(a => a.Id == id)
            .Select(a => new AdminDto
            {
                Id = a.Id,
                Username = a.Username
            })
            .FirstOrDefaultAsync();

        if (admin == null)
        {
            return NotFound("Admin not found.");
        }

        return Ok(admin);
    }

    // POST: api/admins
    /// <summary>Create an administrator</summary>
    /// <remarks>Send username and password as JSON. Both are required. The username is trimmed and must be unique, ignoring case. Returns 201 with the ID, username and a Location header. Missing fields or a duplicate username return 400. Access: requires a JWT token with the Admin role. Missing or invalid tokens return 401; an incorrect role returns 403.</remarks>
    /// <param name="dto">JSON containing the fields described above. See the schema under Request body.</param>
    [HttpPost]
    public async Task<IActionResult> CreateAdmin(CreateAdminDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Username))
        {
            return BadRequest("Username is required.");
        }

        if (string.IsNullOrWhiteSpace(dto.Password))
        {
            return BadRequest("Password is required.");
        }

        var username = dto.Username.Trim();

        var exists = await _context.Admins
            .AnyAsync(a => a.Username.ToLower() == username.ToLower());

        if (exists)
        {
            return BadRequest("Username already exists.");
        }

        var admin = new AdminModel
        {
            Username = username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _context.Admins.Add(admin);
        await _context.SaveChangesAsync();

        var adminDto = new AdminDto
        {
            Id = admin.Id,
            Username = admin.Username
        };

        return CreatedAtAction(
            nameof(GetAdmin),
            new { id = admin.Id },
            adminDto
        );
    }

    // PUT: api/admins/1
    /// <summary>Update an administrator</summary>
    /// <remarks>Send username and an optional new password as JSON. An empty or omitted password keeps the current password. The username is required and must be unique. Returns the ID and updated username. An invalid username returns 400; an unknown ID returns 404. Access: requires a JWT token with the Admin role. Missing or invalid tokens return 401; an incorrect role returns 403.</remarks>
    /// <param name="id">ID of the resource to retrieve, update or delete.</param>
    /// <param name="dto">JSON containing the fields described above. See the schema under Request body.</param>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAdmin(
        int id,
        UpdateAdminDto dto
    )
    {
        if (string.IsNullOrWhiteSpace(dto.Username))
        {
            return BadRequest("Username is required.");
        }

        var admin = await _context.Admins.FindAsync(id);

        if (admin == null)
        {
            return NotFound("Admin not found.");
        }

        var username = dto.Username.Trim();

        var usernameExists = await _context.Admins.AnyAsync(a =>
            a.Id != id &&
            a.Username.ToLower() == username.ToLower()
        );

        if (usernameExists)
        {
            return BadRequest("Username already exists.");
        }

        admin.Username = username;

        if (!string.IsNullOrWhiteSpace(dto.Password))
        {
            admin.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(dto.Password);
        }

        await _context.SaveChangesAsync();

        return Ok(new AdminDto
        {
            Id = admin.Id,
            Username = admin.Username
        });
    }

    // DELETE: api/admins/1
    /// <summary>Delete an administrator</summary>
    /// <remarks>Deletes the administrator with the specified ID and returns 204 with no content. The last administrator cannot be deleted. The code also rejects deleting your own account when the username is present in the token's sub claim. Rejected deletion returns 400; an unknown ID returns 404. Access: requires a JWT token with the Admin role. Missing or invalid tokens return 401; an incorrect role returns 403.</remarks>
    /// <param name="id">ID of the resource to retrieve, update or delete.</param>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAdmin(int id)
    {
        var admin = await _context.Admins.FindAsync(id);

        if (admin == null)
        {
            return NotFound("Admin not found.");
        }

        var adminCount = await _context.Admins.CountAsync();

        if (adminCount <= 1)
        {
            return BadRequest("Cannot delete the last admin.");
        }

        var currentUsername = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

        if (!string.IsNullOrWhiteSpace(currentUsername) &&
            admin.Username.ToLower() == currentUsername.ToLower())
        {
            return BadRequest("You cannot delete your own admin account.");
        }

        _context.Admins.Remove(admin);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}