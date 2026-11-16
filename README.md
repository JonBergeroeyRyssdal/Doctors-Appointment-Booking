# Clinic Appointment Booking System

A full-stack appointment booking system where guests and registered patients can book appointments with doctors. The system also includes an administrative dashboard for managing clinics, doctors, specialities, patients, appointments and administrators.

This project was developed as an exam project using ASP.NET Core Web API, Entity Framework Core, MySQL and React.

---

# Features

## Guest Users

- Book appointments without creating an account
- Select clinic, speciality and doctor
- View available appointment times
- Add a message to the doctor

## Registered Patients

- Register an account
- Log in using JWT authentication
- View personal information
- View upcoming appointments
- Update appointments
- Cancel appointments

## Administrators

- Manage clinics
- Manage doctors
- Manage specialities
- Manage patients
- Manage administrators
- Configure doctor availability
- View all appointments

---

# Technologies

## Backend

- ASP.NET Core Web API
- Entity Framework Core
- MySQL
- JWT Authentication
- Swagger / OpenAPI

## Frontend

- React
- React Router
- React Bootstrap
- Vite

---

# Project Structure

```txt
ClinicAppointmentBookingSystem
│
├── Backend
│   ├── Controllers
│   ├── Data
│   ├── Dtos
│   ├── Models
│   ├── Services
│   └── Seed
│
├── Frontend
│   ├── components
│   ├── pages
│   ├── layouts
│   ├── services
│   ├── utils
│   └── data
│
└── README.md
```

---

# Running the Project

## Backend

Navigate to the Backend folder:

```bash
cd Backend
dotnet run
```

Backend URL:

```txt
http://localhost:5048
```

Swagger documentation:

```txt
http://localhost:5048/doc
```

---

## Frontend

Navigate to the Frontend folder:

```bash
cd Frontend
npm install
npm run dev
```

Frontend URL:

```txt
http://localhost:5173
```

---

# Environment Variables

Create a `.env` file in the Backend project:

```env
DB_HOST=your_host
DB_PORT=3306
DB_NAME=your_database
DB_USER=your_username
DB_PASS=your_password
JWT_KEY=your_secret_key
```

---

# Authentication

Protected endpoints require a JWT Bearer token.

Example:

```txt
Authorization: Bearer {token}
```

---

# Default Admin Account

If the database is initialized using the seeded data:

```txt
Username: admin
Password: admin
```

---

# Business Rules

Appointment creation and updates run in a MySQL transaction at READ COMMITTED
isolation. The service locks the patient row and then the destination doctor row
using `SELECT ... FOR UPDATE` before checking for overlaps. Locks are held until
the transaction commits or rolls back, so concurrent requests for the same patient
or doctor wait and then validate against the latest committed appointments.
Cancellation also locks the patient to serialize it with appointment updates.
This requires InnoDB tables and all booking writes to use `AppointmentService`.
No database migration is required. Integration checks are documented in
[`Tests/BookingConcurrency/README.md`](Tests/BookingConcurrency/README.md).

The system validates that:

- Appointments cannot overlap for the same doctor
- Appointments must be within the next two months
- Appointment duration must be valid
- Appointments must fit within available doctor time windows
- Appointments cannot be updated less than 24 hours before the appointment
- Appointments cannot be cancelled less than 24 hours before the appointment
- Patients can only update their own appointments
- Patients can only cancel their own appointments
- Guest appointments are supported
- Registered patients can manage their own appointments

---

# API Documentation

Base URL:

```txt
http://localhost:5048/api
```

Swagger documentation:

```txt
http://localhost:5048/doc
```

---

# ENDPOINTS

## Authentication

### POST /auth/patient-login

Logs in a registered patient and returns a JWT token.

Example:

```json
{
  "email": "patient@example.com",
  "password": "Password123"
}
```

### POST /admin/auth/login

Logs in an admin and returns a JWT token.

Example:

```json
{
  "username": "admin",
  "password": "admin"
}
```

---

## Clinics

### GET /clinics

Returns all clinics.

### GET /clinics/{id}

Returns one clinic by ID.

### POST /clinics

Creates a clinic.

### PUT /clinics/{id}

Updates a clinic.

### DELETE /clinics/{id}

Deletes a clinic if no dependent doctors or appointments exist.

---

## Specialities

### GET /specialities

Returns all specialities.

### GET /specialities/{id}

Returns one speciality by ID.

### POST /specialities

Creates a speciality.

### PUT /specialities/{id}

Updates a speciality.

### DELETE /specialities/{id}

Deletes a speciality if no dependent doctors or appointments exist.

---

## Doctors

### GET /doctors

Returns all doctors.

### GET /doctors/{id}

Returns one doctor by ID.

### GET /doctors/search?name={name}

Searches for doctors by first name or last name.

### POST /doctors

Creates a doctor.

### PUT /doctors/{id}

Updates a doctor.

### DELETE /doctors/{id}

Deletes a doctor if no dependent appointments exist.

---

## Doctor Availabilities

### GET /doctoravailabilities?doctorId={doctorId}

Returns doctor availability windows.

### POST /doctoravailabilities

Creates availability windows for a doctor.

### GET /doctoravailabilities/available-times

Returns available appointment times.

Parameters:

```txt
doctorId
date
durationMinutes
```

---

## Patients

### GET /patients

Returns all patients.

Requires admin authentication.

### GET /patients/{id}

Returns one patient.

### GET /patients/me

Returns the currently logged-in patient.

Requires patient authentication.

### POST /patients

Registers a new patient.

### PUT /patients/{id}

Updates a patient.

### DELETE /patients/{id}

Deletes a patient if no dependent appointments exist.

---

## Appointments

### GET /appointments

Returns all appointments.

### GET /appointments/{id}

Returns one appointment.

### GET /appointments/my

Returns appointments belonging to the logged-in patient.

Requires patient authentication.

### POST /appointments

Creates a guest appointment.

### POST /appointments/patient

Creates an appointment for the logged-in patient.

Requires patient authentication.

### PUT /appointments/{id}

Updates an appointment.

Requires patient authentication.

### DELETE /appointments/{id}

Cancels an appointment.

Requires patient authentication.

---

## Admins

### GET /admins

Returns all administrators.

Requires admin authentication.

### GET /admins/{id}

Returns one administrator.

Requires admin authentication.

### POST /admins

Creates a new administrator.

Requires admin authentication.

### PUT /admins/{id}

Updates an administrator.

Requires admin authentication.

### DELETE /admins/{id}

Deletes an administrator.

Requires admin authentication.

---

# Database Design

The database is designed according to Third Normal Form (3NF).

Data is separated into dedicated entities such as Clinics, Doctors, Patients, Specialities, Appointments, DoctorAvailabilities and Admins. Relationships between entities are handled through foreign keys.

The Appointment table stores references to Patient, Doctor, Clinic and Speciality. Although ClinicId and SpecialityId can technically be derived through DoctorId, these fields are intentionally stored in the Appointment table to preserve the original booking context.

If a doctor changes clinic or speciality after an appointment has been booked, the appointment will still reflect the clinic and speciality selected at the time of booking.

This design choice prioritizes historical accuracy while maintaining a normalized database structure.

---

# References

The following resources and tools were used during development:

- ChatGPT (OpenAI) for explanations, debugging guidance, planning and understanding programming concepts.
- Microsoft Learn documentation for ASP.NET Core and Entity Framework Core.
- React documentation.
- Bootstrap documentation.
- Official MySQL documentation.
