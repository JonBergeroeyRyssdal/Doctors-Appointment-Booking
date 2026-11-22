import { Navbar, Nav, Container } from "react-bootstrap";
import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import LogoutButton from "../components/ui/LogoutButton";

function Header() {
  useLocation();
  const [expanded, setExpanded] = useState(false);
  const patient = Boolean(localStorage.getItem("token"));
  const admin = Boolean(localStorage.getItem("adminToken"));
  const closeMenu = () => setExpanded(false);
  return (
    <Navbar expand="lg" variant="light" expanded={expanded} onToggle={setExpanded} className="app-navbar py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={closeMenu}>Clinic</Navbar.Brand>
        <Navbar.Toggle aria-controls="clinic-navigation" aria-label="Toggle navigation" />
        <Navbar.Collapse id="clinic-navigation">
          <Nav className="ms-auto gap-lg-1" aria-label="Main navigation" onClick={closeMenu}>
            <Nav.Link as={NavLink} end to="/search">Doctors</Nav.Link>
            <Nav.Link as={NavLink} end to="/clinics">Clinics</Nav.Link>
            {patient && <Nav.Link as={NavLink} end to="/patient/appointments">My appointments</Nav.Link>}
          </Nav>
          <Nav className="nav-account" aria-label="Account navigation" onClick={closeMenu}>
            {!patient && !admin && <Nav.Link as={NavLink} end to="/login">Log in</Nav.Link>}
            {patient && <Nav.Link as={NavLink} to="/patient/dashboard">My account</Nav.Link>}
            {admin && <Nav.Link as={NavLink} to="/admin/dashboard">Administration</Nav.Link>}
            {patient && <LogoutButton className="nav-logout" onLogout={closeMenu}>{admin ? "Log out as patient" : "Log out"}</LogoutButton>}
            {admin && <LogoutButton account="admin" className="nav-logout" onLogout={closeMenu}>{patient ? "Log out as admin" : "Log out"}</LogoutButton>}
            {(!admin || patient) && <NavLink to={patient ? "/patient/book" : "/book"} className="btn btn-primary nav-booking" onClick={closeMenu}>Book appointment</NavLink>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default Header;
