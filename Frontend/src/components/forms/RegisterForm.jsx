import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PatientForm from "./PatientForm";

import { createPatient } from "../../services/patientsApi";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  socialSecurityNumber: "",
  birthdate: "",
  gender: "",
  taxNumber: "",
  religion: "",
  driversLicenseNumber: "",
  medicalInsuranceMemberNumber: "",
  password: "",
  confirmPassword: "",
};

function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await createPatient(formData);

      navigate("/register/success");
    } catch (error) {
      setError(error.message || "Could not register patient.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PatientForm
      formData={formData}
      error={error}
      loading={loading}
      onChange={handleChange}
      onSubmit={handleSubmit}
      buttonText="Register"
      buttonVariant="primary"
      loadingText="Registering..."
    />
  );
}

export default RegisterForm;
