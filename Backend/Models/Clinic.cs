namespace Backend.Models;

public class Clinic
{
    public int Id { get; set; }

    public string Name { get; set; } = "";

    public string Address { get; set; } = "";

    public string PostalCode { get; set; } = "";

    public string City { get; set; } = "";

    public List<Doctor> Doctors { get; set; } = new();

    public List<Appointment> Appointments { get; set; } = new();
}