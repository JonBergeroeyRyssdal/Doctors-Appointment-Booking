import { useEffect, useState } from "react";
import { Alert, Button, Card } from "react-bootstrap";

import PageLayout from "../../layouts/PageLayout";
import ListTable from "../../components/ui/ListTable";
import UniversalForm from "../../components/forms/UniversalForm";

import { clinicFields } from "../../data/clinicFields";
import { getClinicColumns } from "../../data/clinicColumns";

import {
  getClinics,
  createClinic,
  updateClinic,
  deleteClinic,
} from "../../services/clinicsApi";

function AdminClinicsPage() {
  const [clinics, setClinics] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    postalCode: "",
    city: "",
  });

  const [editingClinicId, setEditingClinicId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllClinics();
  }, []);

  async function fetchAllClinics() {
    try {
      setLoading(true);
      setError("");

      const data = await getClinics();
      setClinics(data);
    } catch (error) {
      console.error(error);
      setError("Could not load clinics.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Clinic name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      if (editingClinicId) {
        await updateClinic(editingClinicId, formData);
        setMessage("Clinic updated successfully.");
      } else {
        await createClinic(formData);
        setMessage("Clinic added successfully.");
      }

      resetForm();
      await fetchAllClinics();
    } catch (error) {
      console.error(error);
      setError("Could not save clinic.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(clinic) {
    setEditingClinicId(clinic.id);

    setFormData({
      name: clinic.name || "",
      address: clinic.address || "",
      postalCode: clinic.postalCode || "",
      city: clinic.city || "",
    });

    setMessage("");
    setError("");
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this clinic?",
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await deleteClinic(id);

      setMessage("Clinic deleted successfully.");
      await fetchAllClinics();
    } catch (error) {
      console.error(error);
      setError(
        "Could not delete clinic. It may have doctors or appointments connected to it.",
      );
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingClinicId(null);

    setFormData({
      name: "",
      address: "",
      postalCode: "",
      city: "",
    });
  }

  const columns = getClinicColumns(handleEdit, handleDelete);

  return (
    <PageLayout
      title="Manage clinics"
      subtitle="View, add, edit and delete clinics in the system."
      size="large"
    >
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>
            {editingClinicId ? "Edit clinic" : "Add new clinic"}
          </Card.Title>

          <UniversalForm
            fields={clinicFields}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            buttonText={editingClinicId ? "Update clinic" : "Add clinic"}
            loading={loading}
            loadingText={editingClinicId ? "Updating..." : "Saving..."}
            buttonVariant="primary"
          />

          {editingClinicId && (
            <Button
              type="button"
              variant="secondary"
              onClick={resetForm}
              disabled={loading}
              className="mt-2"
            >
              Cancel
            </Button>
          )}
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Clinics</Card.Title>

          <ListTable
            columns={columns}
            items={clinics}
            loading={loading}
            emptyMessage="No clinics found."
          />
        </Card.Body>
      </Card>
    </PageLayout>
  );
}

export default AdminClinicsPage;
