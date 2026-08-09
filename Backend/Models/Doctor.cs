namespace Backend.Models;

public class Doctor
{
    public int Id { get; set; }

    public string FirstName { get; set; } = "";

    public string LastName { get; set; } = "";

    // Clinic relationship
    // One doctor belongs to one clinic
    public int ClinicId { get; set; }

    public Clinic? Clinic { get; set; }

    // Speciality relationship
    // Many doctors can share the same speciality
    public int SpecialityId { get; set; }

    public Speciality? Speciality { get; set; }

    // Appointment relationship
    // One doctor can have many appointments
    public List<Appointment> Appointments { get; set; } = new();

    // Availability relationship
    // One doctor can have many availability windows
    public List<DoctorAvailability> Availabilities { get; set; } = new();
}
