import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { logoutAdmin, logoutPatient } from "../../services/authStorage";
import AppIcon from "./AppIcon";

function LogoutButton({ account = "patient", children = "Log out", className = "", onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    if (account === "admin") logoutAdmin();
    else logoutPatient();
    onLogout?.();
    navigate(account === "admin" ? "/admin/login" : "/login", { replace: true });
  }

  return (
    <Button type="button" variant="outline-secondary" size="sm" className={`logout-button ${className}`} onClick={handleLogout}>
      <AppIcon name="logout" />
      {children}
    </Button>
  );
}

export default LogoutButton;
