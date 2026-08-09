import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className=" text-center py-3 mt-5">
      <p className="mb-2">© 2026 Clinic Appointment Booking System</p>

      <div className="d-flex flex-column align-items-center">
        <Link to="/admin/login" className="text-decoration-none">
          Admin
        </Link>

        <Link to="/not-implemented" className="text-decoration-none">
          Doctor
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
