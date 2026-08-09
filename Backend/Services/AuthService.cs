using Backend.Data;
using Backend.Dtos;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Services;

public class AuthService
{
    private readonly AppDbContext _context;
    private readonly JwtSettings _jwtSettings;

    public AuthService(AppDbContext context, JwtSettings jwtSettings)
    {
        _context = context;
        _jwtSettings = jwtSettings;
    }

    public async Task<(bool Success, string? Message, string? Token, Patient? Patient)>
        PatientLogin(PatientLoginDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) ||
            string.IsNullOrWhiteSpace(dto.Password))
        {
            return (
                false,
                "Email and password are required.",
                null,
                null
            );
        }

        var email = dto.Email.Trim().ToLower();

        var patient = await _context.Patients
            .FirstOrDefaultAsync(p =>
                p.Email.ToLower() == email &&
                p.Role == "Patient"
            );

        if (patient == null || string.IsNullOrEmpty(patient.PasswordHash))
        {
            return (
                false,
                "Invalid email or password.",
                null,
                null
            );
        }

        bool validPassword = BCrypt.Net.BCrypt.Verify(
            dto.Password,
            patient.PasswordHash
        );

        if (!validPassword)
        {
            return (
                false,
                "Invalid email or password.",
                null,
                null
            );
        }

        var token = GenerateJwtToken(patient);

        return (
            true,
            null,
            token,
            patient
        );
    }

    private string GenerateJwtToken(Patient patient)
    {
        var claims = new[]
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                patient.Id.ToString()
            ),

            new Claim(
                JwtRegisteredClaimNames.Sub,
                patient.Id.ToString()
            ),

            new Claim(
                ClaimTypes.Email,
                patient.Email
            ),

            new Claim(
                ClaimTypes.Role,
                patient.Role
            ),

            new Claim(
                JwtRegisteredClaimNames.Jti,
                Guid.NewGuid().ToString()
            )
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_jwtSettings.SecretKey)
        );

        var creds = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.Now.AddMinutes(_jwtSettings.ExpiryMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}