using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Clinic> Clinics { get; set; }

    public DbSet<Doctor> Doctors { get; set; }

    public DbSet<Speciality> Specialities { get; set; }

    public DbSet<Patient> Patients { get; set; }

    public DbSet<Appointment> Appointments { get; set; }

    public DbSet<DoctorAvailability> DoctorAvailabilities { get; set; }

    public DbSet<Admin> Admins { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Prevent duplicate clinic names
        modelBuilder.Entity<Clinic>()
            .HasIndex(c => c.Name)
            .IsUnique();

        // Prevent duplicate speciality names
        modelBuilder.Entity<Speciality>()
            .HasIndex(s => s.Name)
            .IsUnique();

        // Prevent duplicate patient emails
        modelBuilder.Entity<Patient>()
            .HasIndex(p => p.Email)
            .IsUnique();

        // Prevent duplicate doctors in the same speciality
        modelBuilder.Entity<Doctor>()
            .HasIndex(d => new { d.FirstName, d.LastName, d.SpecialityId })
            .IsUnique();


        // Prevent duplicate availability windows
        // for the same doctor
        modelBuilder.Entity<DoctorAvailability>()
    .HasIndex(da => new
    {
        da.DoctorId,
        da.DayOfWeek,
        da.StartTime,
        da.EndTime,
    })
    .IsUnique();
    }
}