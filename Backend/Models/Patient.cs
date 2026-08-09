namespace Backend.Models;

public class Patient
{
    public int Id { get; set; }

    // Common data for both guest and registered patients
    public string FirstName { get; set; } = "";

    public string LastName { get; set; } = "";

    public string Email { get; set; } = "";

    public DateTime? Birthdate { get; set; }

    public string? Gender { get; set; }


    // Login fields (only for registered users)
    public string? PasswordHash { get; set; }

    public string Role { get; set; } = "Guest";

    // Optional patient information
    public string? SocialSecurityNumber { get; set; }

    public string? TaxNumber { get; set; }

    public string? Religion { get; set; }

    public string? DriversLicenseNumber { get; set; }

    public string? MedicalInsuranceMemberNumber { get; set; }

    // Relationships
    public List<Appointment> Appointments { get; set; } = new();
}