import { Link, useLocation } from "react-router-dom";
import LogoutButton from "../components/ui/LogoutButton";

function Footer() {
  // Refresh account links when navigation follows sign-in or sign-out.
  useLocation();
  const patientSignedIn = Boolean(localStorage.getItem("token"));
  const adminSignedIn = Boolean(localStorage.getItem("adminToken"));
  const year = new Date().getFullYear();
  const accountLinks = patientSignedIn
    ? [
        { to: "/patient/dashboard", label: "My dashboard" },
        { to: "/patient/appointments", label: "My appointments" },
        { to: "/patient/information", label: "My information" },
      ]
    : [
        { to: "/login", label: "Patient login" },
        { to: "/register", label: "Create an account" },
      ];

  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-intro">
            <Link to="/" className="footer-brand" aria-label="Clinic home">
              <span className="footer-brand-mark" aria-hidden="true">+</span>
              Clinic
            </Link>
            <p>Find a doctor, choose a time and manage your appointments in one place.</p>
            {!adminSignedIn && (
              <Link to={patientSignedIn ? "/patient/book" : "/book"} className="footer-booking-link">
                Book an appointment <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </div>

          <nav aria-label="Explore the clinic" className="footer-link-group">
            <h2>Explore</h2>
            <ul>
              <li><Link to="/clinics">Our clinics</Link></li>
              <li><Link to="/search">Find a doctor</Link></li>
              <li><Link to="/about">About us</Link></li>
            </ul>
          </nav>

          <nav aria-label="Patient account" className="footer-link-group">
            <h2>{patientSignedIn ? "Your account" : "For patients"}</h2>
            <ul>
              {accountLinks.map(({ to, label }) => <li key={to}><Link to={to}>{label}</Link></li>)}
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <p>&copy; {year} Clinic Appointment Booking</p>
          <div className="footer-account-actions">
          <Link to={adminSignedIn ? "/admin/dashboard" : "/admin/login"} className="footer-staff-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            {adminSignedIn ? "Admin dashboard" : "Staff login"}
          </Link>
          {patientSignedIn && <LogoutButton>{adminSignedIn ? "Log out as patient" : "Log out"}</LogoutButton>}
          {adminSignedIn && <LogoutButton account="admin">{patientSignedIn ? "Log out as admin" : "Log out"}</LogoutButton>}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
