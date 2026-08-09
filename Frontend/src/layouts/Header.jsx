import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { logoutPatient, logoutAdmin } from "../services/authStorage";

function Header() {
  const navigate = useNavigate();

  const patientToken = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");

  const isPatientLoggedIn = !!patientToken;
  const isAdminLoggedIn = !!adminToken;

  function handlePatientLogout() {
    logoutPatient();
    navigate("/");
  }

  function handleAdminLogout() {
    logoutAdmin();
    navigate("/admin/login");
  }

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Clinic
        </Navbar.Brand>

        <Nav>
          {!isPatientLoggedIn && !isAdminLoggedIn && (
            <Nav.Link as={Link} to="/book">
              Book appointment
            </Nav.Link>
          )}

          {isPatientLoggedIn && (
            <Nav.Link as={Link} to="/patient/book">
              Book appointment
            </Nav.Link>
          )}

          <Nav.Link as={Link} to="/about">
            About
          </Nav.Link>

          <Nav.Link as={Link} to="/search">
            Doctors
          </Nav.Link>

          <Nav.Link as={Link} to="/clinics">
            Clinics
          </Nav.Link>

          <Nav.Link as={Link} to="/not-implemented">
            Specialities
          </Nav.Link>

          {!isPatientLoggedIn && !isAdminLoggedIn && (
            <>
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>

              <Nav.Link as={Link} to="/register">
                Register
              </Nav.Link>
            </>
          )}

          {isPatientLoggedIn && (
            <>
              <Nav.Link as={Link} to="/patient/dashboard">
                Patient Dashboard
              </Nav.Link>

              <Nav.Link onClick={handlePatientLogout}>Logout</Nav.Link>
            </>
          )}

          {isAdminLoggedIn && (
            <>
              <Nav.Link as={Link} to="/admin/dashboard">
                Admin Dashboard
              </Nav.Link>

              <Nav.Link onClick={handleAdminLogout}>Admin Logout</Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
