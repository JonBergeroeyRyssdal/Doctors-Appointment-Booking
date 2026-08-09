# Backend

ASP.NET Core Web API for the Clinic Appointment Booking System.

## Tech Stack

- ASP.NET Core Web API
- Entity Framework Core
- MySQL
- JWT Authentication
- Swagger / OpenAPI

## Run the Project

Restore dependencies:

```bash
dotnet restore
```

Run the API:

```bash
dotnet run
```

API URL:

```txt
http://localhost:5048
```

Swagger documentation:

```txt
http://localhost:5048/doc
```

## Environment Variables

Create a `.env` file in the Backend project:

```env
DB_HOST=your_host
DB_PORT=3306
DB_NAME=your_database
DB_USER=your_username
DB_PASS=your_password
JWT_KEY=your_secret_key
```

## Database

This project uses Entity Framework Core with MySQL.

Apply migrations:

```bash
dotnet ef database update
```

Create a new migration:

```bash
dotnet ef migrations add MigrationName
```

## Authentication

The API uses JWT authentication.

Protected endpoints require:

```txt
Authorization: Bearer {token}
```

## Documentation

Full project documentation, business rules and endpoint documentation can be found in the root README file.
