import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginForm from "../../components/forms/LoginForm";

import { loginAdmin } from "../../services/authApi";
import { saveAdminAuth } from "../../services/authStorage";

function AdminLoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "admin",
    password: "admin",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginAdmin(formData);

      saveAdminAuth(data);

      navigate("/admin/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoginForm
      title="Admin Login"
      identifierLabel="Username"
      identifierName="username"
      identifierType="text"
      identifierPlaceholder="Enter username"
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      buttonText="Login as admin"
      loading={loading}
      error={error}
    />
  );
}

export default AdminLoginPage;
