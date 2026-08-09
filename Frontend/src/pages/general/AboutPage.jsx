import PageLayout from "../../layouts/PageLayout";

function AboutPage() {
  return (
    <PageLayout
      title="About Clinic Appointment Booking"
      subtitle="Learn more about the application and its features."
      size="large"
    >
      <p>
        This application allows patients to book appointments with doctors at
        different clinics. Patients can use the system without creating an
        account.
      </p>

      <p>
        Users can search for doctors, view clinic and speciality information,
        and choose an available appointment time.
      </p>

      <p>
        The system is built as a full-stack web application using React for the
        frontend, ASP.NET Core for the backend, Entity Framework for database
        access, and MySQL as the database.
      </p>

      <h2 className="h4 mt-4">Main features</h2>

      <ul className="mb-0">
        <li>Book appointments as a guest or registered patient</li>
        <li>Search for doctors by first name or last name</li>
        <li>View doctor, clinic, and speciality information</li>
        <li>Prevent conflicting appointment bookings</li>
        <li>Use Swagger documentation for the REST API</li>
      </ul>
    </PageLayout>
  );
}

export default AboutPage;
