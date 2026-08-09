import { useEffect, useState } from "react";
import { Alert, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import PageLayout from "../../layouts/PageLayout";
import ListTable from "../../components/ui/ListTable";

import { getPatients, deletePatient } from "../../services/patientsApi";

function AdminPatientsPage() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllPatients();
  }, []);

  async function fetchAllPatients() {
    try {
      setLoading(true);
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error(error);
      setError("Could not load patients.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(patient) {
    navigate(`/admin/patients/${patient.id}/edit`);
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this patient?",
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await deletePatient(id);

      setMessage("Patient deleted successfully.");
      fetchAllPatients();
    } catch (error) {
      console.error(error);
      setError(
        "Could not delete patient. The patient may have appointments connected to them.",
      );
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { key: "id", label: "ID" },
    {
      key: "name",
      label: "Name",
      render: (patient) => `${patient.firstName} ${patient.lastName}`,
    },
    { key: "email", label: "Email" },
    {
      key: "birthdate",
      label: "Birthdate",
      render: (patient) =>
        patient.birthdate ? patient.birthdate.substring(0, 10) : "-",
    },
    {
      key: "gender",
      label: "Gender",
      render: (patient) => patient.gender || "-",
    },
    {
      key: "role",
      label: "Role",
      render: (patient) => (patient.role === "Patient" ? "Patient" : "Guest"),
    },
    {
      key: "edit",
      label: "Edit",
      render: (patient) => (
        <Button size="sm" variant="warning" onClick={() => handleEdit(patient)}>
          Edit
        </Button>
      ),
    },
    {
      key: "delete",
      label: "Delete",
      render: (patient) => (
        <Button
          size="sm"
          variant="danger"
          onClick={() => handleDelete(patient.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <PageLayout
      title="Manage patients"
      subtitle="View, edit and delete patients in the system."
      size="large"
    >
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>Register new patient</Card.Title>

          <p className="mb-3">
            New patients should be registered through the normal patient
            registration page.
          </p>

          <Button as={Link} to="/register" variant="primary">
            Go to register page
          </Button>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Patients</Card.Title>

          <ListTable
            columns={columns}
            items={patients}
            loading={loading}
            emptyMessage="No patients found."
          />
        </Card.Body>
      </Card>
    </PageLayout>
  );
}

export default AdminPatientsPage;
