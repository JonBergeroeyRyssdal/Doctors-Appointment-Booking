namespace Backend.Models;

public class Speciality
{
    public int Id { get; set; }

    public string Name { get; set; } = "";

    public List<Doctor> Doctors { get; set; } = new();
}