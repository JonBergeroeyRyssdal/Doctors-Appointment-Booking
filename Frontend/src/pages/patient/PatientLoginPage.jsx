import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/forms/LoginForm";

import { loginPatient } from "../../services/authApi";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const data = await loginPatient(formData);

      localStorage.setItem("token", data.token);

      if (data.patient) {
        localStorage.setItem("patient", JSON.stringify(data.patient));
      }

      navigate("/patient/dashboard");
    } catch (error) {
      console.error(error);
      setError(error.message || "Could not log in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoginForm
      title="Patient Login"
      subtitle="Sign in to see your appointments and patient information."
      identifierLabel="Email"
      identifierName="email"
      identifierType="email"
      identifierPlaceholder="Enter email"
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      buttonText="Login"
      loading={loading}
      error={error}
    />
  );
}

export default LoginPage;
