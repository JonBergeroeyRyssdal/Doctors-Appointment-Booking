namespace Backend.Dtos;

public class CreatePatientDto
{
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string Email { get; set; } = "";
    public DateTime? Birthdate { get; set; }
    public string? Gender { get; set; }

    public string? SocialSecurityNumber { get; set; }
    public string? TaxNumber { get; set; }
    public string? Religion { get; set; }
    public string? DriversLicenseNumber { get; set; }
    public string? MedicalInsuranceMemberNumber { get; set; }

    public string Password { get; set; } = "";
}