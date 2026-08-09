using Backend.Models;
using BCrypt.Net;

namespace Backend.Data;

public static class DbInitializer
{
    public static void Seed(AppDbContext context)
    {
        context.Database.EnsureCreated();

        if (context.Clinics.Any() || context.Specialities.Any() || context.Doctors.Any())
        {
            return;
        }

        var clinics = new List<Clinic>
{
    new Clinic
    {
        Name = "Moss Medical Center",
        Address = "Dronningens gate 1",
        PostalCode = "1532",
        City = "Moss"
    },
    new Clinic
    {
        Name = "Oslo Health Clinic",
        Address = "Karl Johans gate 10",
        PostalCode = "0154",
        City = "Oslo"
    },
    new Clinic
    {
        Name = "Fredrikstad Family Clinic",
        Address = "Storgata 5",
        PostalCode = "1607",
        City = "Fredrikstad"
    },
    new Clinic
    {
        Name = "Bergen Medical Center",
        Address = "Torgallmenningen 8",
        PostalCode = "5014",
        City = "Bergen"
    },
    new Clinic
    {
        Name = "Trondheim Health Clinic",
        Address = "Munkegata 12",
        PostalCode = "7011",
        City = "Trondheim"
    },
    new Clinic
    {
        Name = "Stavanger Family Practice",
        Address = "Kirkegata 15",
        PostalCode = "4006",
        City = "Stavanger"
    },
    new Clinic
    {
        Name = "Kristiansand Medical Center",
        Address = "Markens gate 25",
        PostalCode = "4611",
        City = "Kristiansand"
    },
    new Clinic
    {
        Name = "Tromsø Health Clinic",
        Address = "Storgata 42",
        PostalCode = "9008",
        City = "Tromsø"
    },
    new Clinic
    {
        Name = "Drammen Family Clinic",
        Address = "Bragernes Torg 3",
        PostalCode = "3017",
        City = "Drammen"
    },
    new Clinic
    {
        Name = "Sandefjord Medical Center",
        Address = "Jernbanealléen 20",
        PostalCode = "3210",
        City = "Sandefjord"
    }
};

        context.Clinics.AddRange(clinics);

        var specialities = new List<Speciality>
        {
            new Speciality { Name = "General Medicine" },
            new Speciality { Name = "Cardiology" },
            new Speciality { Name = "Dermatology" },
            new Speciality { Name = "Pediatrics" }
        };

        context.Specialities.AddRange(specialities);

        context.SaveChanges();

        var doctors = new List<Doctor>
{
    // Moss Medical Center
    new Doctor
    {
        FirstName = "Anna",
        LastName = "Hansen",
        ClinicId = clinics[0].Id,
        SpecialityId = specialities[0].Id
    },
    new Doctor
    {
        FirstName = "Lars",
        LastName = "Nilsen",
        ClinicId = clinics[0].Id,
        SpecialityId = specialities[3].Id
    },
    new Doctor
    {
        FirstName = "Sofie",
        LastName = "Andersen",
        ClinicId = clinics[0].Id,
        SpecialityId = specialities[1].Id
    },

    // Oslo Health Clinic
    new Doctor
    {
        FirstName = "Erik",
        LastName = "Johansen",
        ClinicId = clinics[1].Id,
        SpecialityId = specialities[1].Id
    },
    new Doctor
    {
        FirstName = "Kristin",
        LastName = "Lunde",
        ClinicId = clinics[1].Id,
        SpecialityId = specialities[0].Id
    },
    new Doctor
    {
        FirstName = "Morten",
        LastName = "Dahl",
        ClinicId = clinics[1].Id,
        SpecialityId = specialities[2].Id
    },

    // Fredrikstad Family Clinic
    new Doctor
    {
        FirstName = "Maria",
        LastName = "Berg",
        ClinicId = clinics[2].Id,
        SpecialityId = specialities[2].Id
    },
    new Doctor
    {
        FirstName = "Henrik",
        LastName = "Solberg",
        ClinicId = clinics[2].Id,
        SpecialityId = specialities[3].Id
    },

    // Bergen Medical Center
    new Doctor
    {
        FirstName = "Camilla",
        LastName = "Aasen",
        ClinicId = clinics[3].Id,
        SpecialityId = specialities[0].Id
    },
    new Doctor
    {
        FirstName = "Thomas",
        LastName = "Vik",
        ClinicId = clinics[3].Id,
        SpecialityId = specialities[1].Id
    },
    new Doctor
    {
        FirstName = "Julie",
        LastName = "Moen",
        ClinicId = clinics[3].Id,
        SpecialityId = specialities[2].Id
    },

    // Trondheim Health Clinic
    new Doctor
    {
        FirstName = "Ole",
        LastName = "Rønning",
        ClinicId = clinics[4].Id,
        SpecialityId = specialities[3].Id
    },
    new Doctor
    {
        FirstName = "Ingrid",
        LastName = "Sæther",
        ClinicId = clinics[4].Id,
        SpecialityId = specialities[0].Id
    },

    // Stavanger Family Practice
    new Doctor
    {
        FirstName = "Martin",
        LastName = "Haug",
        ClinicId = clinics[5].Id,
        SpecialityId = specialities[1].Id
    },
    new Doctor
    {
        FirstName = "Elise",
        LastName = "Knutsen",
        ClinicId = clinics[5].Id,
        SpecialityId = specialities[2].Id
    },

    // Kristiansand Medical Center
    new Doctor
    {
        FirstName = "Petter",
        LastName = "Larsen",
        ClinicId = clinics[6].Id,
        SpecialityId = specialities[0].Id
    },
    new Doctor
    {
        FirstName = "Silje",
        LastName = "Nygård",
        ClinicId = clinics[6].Id,
        SpecialityId = specialities[3].Id
    },

    // Tromsø Health Clinic
    new Doctor
    {
        FirstName = "Jonas",
        LastName = "Eide",
        ClinicId = clinics[7].Id,
        SpecialityId = specialities[1].Id
    },
    new Doctor
    {
        FirstName = "Marte",
        LastName = "Kristoffersen",
        ClinicId = clinics[7].Id,
        SpecialityId = specialities[2].Id
    },

    // Drammen Family Clinic
    new Doctor
    {
        FirstName = "Fredrik",
        LastName = "Bakke",
        ClinicId = clinics[8].Id,
        SpecialityId = specialities[0].Id
    },
    new Doctor
    {
        FirstName = "Helene",
        LastName = "Lind",
        ClinicId = clinics[8].Id,
        SpecialityId = specialities[1].Id
    },

    // Sandefjord Medical Center
    new Doctor
    {
        FirstName = "Andreas",
        LastName = "Holm",
        ClinicId = clinics[9].Id,
        SpecialityId = specialities[2].Id
    },
    new Doctor
    {
        FirstName = "Kari",
        LastName = "Bjørnstad",
        ClinicId = clinics[9].Id,
        SpecialityId = specialities[3].Id
    }
};

        context.Doctors.AddRange(doctors);

        context.SaveChanges();

        var availabilities = new List<DoctorAvailability>();

        foreach (var doctor in doctors)
        {
            for (int day = 1; day <= 5; day++)
            {
                availabilities.Add(new DoctorAvailability
                {
                    DoctorId = doctor.Id,
                    DayOfWeek = (DayOfWeek)day,
                    StartTime = new TimeSpan(8, 0, 0),
                    EndTime = new TimeSpan(11, 30, 0)
                });

                availabilities.Add(new DoctorAvailability
                {
                    DoctorId = doctor.Id,
                    DayOfWeek = (DayOfWeek)day,
                    StartTime = new TimeSpan(12, 30, 0),
                    EndTime = new TimeSpan(16, 0, 0)
                });
            }
        }

        context.DoctorAvailabilities.AddRange(availabilities);

        var admin = new Admin
        {
            Username = "admin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin")
        };

        context.Admins.Add(admin);

        context.SaveChanges();
    }
}