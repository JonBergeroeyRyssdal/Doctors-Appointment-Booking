import { Navbar, Nav, Container } from "react-bootstrap";
import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import LogoutButton from "../components/ui/LogoutButton";

function Header() {
  useLocation();
  const [expanded, setExpanded] = useState(false);

  const patientToken = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");

  const isPatientLoggedIn = !!patientToken;
  const isAdminLoggedIn = !!adminToken;

  return (
    <Navbar expand="lg" variant="light" expanded={expanded} onToggle={setExpanded} className="app-navbar py-3">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Clinic
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="clinic-navigation" aria-label="Toggle navigation" />
        <Navbar.Collapse id="clinic-navigation">
        <Nav className="ms-auto gap-lg-1" onClick={() => setExpanded(false)}>
          {!isPatientLoggedIn && !isAdminLoggedIn && (
            <Nav.Link as={NavLink} end to="/book">
              Book appointment
            </Nav.Link>
          )}

          {isPatientLoggedIn && (
            <Nav.Link as={NavLink} end to="/patient/book">
              Book appointment
            </Nav.Link>
          )}

          <Nav.Link as={NavLink} end to="/about">
            About
          </Nav.Link>

          <Nav.Link as={NavLink} end to="/search">
            Doctors
          </Nav.Link>

          <Nav.Link as={NavLink} end to="/clinics">
            Clinics
          </Nav.Link>

          <Nav.Link as={NavLink} end to="/not-implemented">
            Specialities
          </Nav.Link>

          {!isPatientLoggedIn && !isAdminLoggedIn && (
            <>
              <Nav.Link as={NavLink} end to="/login">
                Login
              </Nav.Link>

              <Nav.Link as={NavLink} end to="/register">
                Register
              </Nav.Link>
            </>
          )}

          {isPatientLoggedIn && (
            <>
              <Nav.Link as={NavLink} end to="/patient/dashboard">
                Patient Dashboard
              </Nav.Link>

              <LogoutButton className="nav-logout" onLogout={() => setExpanded(false)}>
                {isAdminLoggedIn ? "Log out as patient" : "Log out"}
              </LogoutButton>
            </>
          )}

          {isAdminLoggedIn && (
            <>
              <Nav.Link as={NavLink} end to="/admin/dashboard">
                Admin Dashboard
              </Nav.Link>

              <LogoutButton account="admin" className="nav-logout" onLogout={() => setExpanded(false)}>
                {isPatientLoggedIn ? "Log out as admin" : "Log out"}
              </LogoutButton>
            </>
          )}
        </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
