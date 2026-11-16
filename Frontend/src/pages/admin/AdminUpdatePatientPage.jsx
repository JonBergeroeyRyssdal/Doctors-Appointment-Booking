import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import PageLayout from "../../layouts/PageLayout";

import { getPatientById, updatePatient } from "../../services/patientsApi";

import PatientForm from "../../components/forms/PatientForm";
import ManagementPanel from "../../components/ui/ManagementPanel";
import { updatePatientFields } from "../../data/updatePatientFields";

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
};

function AdminUpdatePatientPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPatient();
  }, [id]);

  async function fetchPatient() {
    try {
      setLoading(true);

      const patient = await getPatientById(id);

      setFormData({
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        email: patient.email || "",
        socialSecurityNumber: patient.socialSecurityNumber || "",
        birthdate: patient.birthdate ? patient.birthdate.substring(0, 10) : "",
        gender: patient.gender || "",
        taxNumber: patient.taxNumber || "",
        religion: patient.religion || "",
        driversLicenseNumber: patient.driversLicenseNumber || "",
        medicalInsuranceMemberNumber:
          patient.medicalInsuranceMemberNumber || "",
      });
    } catch (error) {
      console.error(error);
      setError("Could not load patient.");
    } finally {
      setLoading(false);
    }
  }

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

    try {
      setLoading(true);

      const patientPayload = {
        id: Number(id),
        ...formData,
        birthdate: formData.birthdate || null,
      };

      await updatePatient(id, patientPayload);

      navigate("/admin/patients");
    } catch (error) {
      console.error(error);
      setError(error.message || "Could not update patient.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout title="Update patient" subtitle="Edit patient information." eyebrow="Patient records">
      <ManagementPanel icon="users" title="Patient details" description="Keep personal, contact and insurance information up to date.">
          <PatientForm
            fields={updatePatientFields}
            formData={formData}
            error={error}
            loading={loading}
            onChange={handleChange}
            onSubmit={handleSubmit}
            buttonText="Update patient"
            buttonVariant="warning"
            loadingText="Updating..."
          />

          <Button
            variant="outline-secondary"
            className="mt-3"
            onClick={() => navigate("/admin/patients")}
          >
            Cancel
          </Button>
      </ManagementPanel>
    </PageLayout>
  );
}

export default AdminUpdatePatientPage;
