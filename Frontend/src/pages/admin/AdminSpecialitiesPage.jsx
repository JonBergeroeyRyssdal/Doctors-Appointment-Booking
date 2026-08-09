import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";

import PageLayout from "../../layouts/PageLayout";
import ListTable from "../../components/ui/ListTable";
import UniversalForm from "../../components/forms/UniversalForm";

import { getSpecialityColumns } from "../../data/specialitiesColumns";

import {
  getSpecialities,
  createSpeciality,
  updateSpeciality,
  deleteSpeciality,
} from "../../services/specialitiesApi";

const initialFormData = {
  name: "",
};

const fields = [
  {
    name: "name",
    label: "Speciality name",
    type: "text",
    placeholder: "Enter speciality name",
    required: true,
  },
];

function AdminSpecialitiesPage() {
  const [specialities, setSpecialities] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  const [editingSpecialityId, setEditingSpecialityId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllSpecialities();
  }, []);

  async function fetchAllSpecialities() {
    try {
      setLoading(true);

      const data = await getSpecialities();
      setSpecialities(data);
    } catch (error) {
      console.error(error);
      setError("Could not load specialities.");
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
      setError("Speciality name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      if (editingSpecialityId) {
        await updateSpeciality(editingSpecialityId, formData);
        setMessage("Speciality updated successfully.");
      } else {
        await createSpeciality(formData);
        setMessage("Speciality added successfully.");
      }

      resetForm();
      await fetchAllSpecialities();
    } catch (error) {
      console.error(error);
      setError("Could not save speciality.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(speciality) {
    setEditingSpecialityId(speciality.id);
    setFormData({ name: speciality.name || "" });
    setError("");
    setMessage("");
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this speciality?",
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await deleteSpeciality(id);

      setMessage("Speciality deleted successfully.");
      await fetchAllSpecialities();
    } catch (error) {
      console.error(error);
      setError(
        "Could not delete speciality. It may have doctors connected to it.",
      );
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingSpecialityId(null);
    setFormData(initialFormData);
  }

  const columns = getSpecialityColumns(handleEdit, handleDelete);

  return (
    <PageLayout
      title="Manage specialities"
      subtitle="View, add, edit and delete medical specialities."
      size="large"
    >
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>
            {editingSpecialityId ? "Edit speciality" : "Add new speciality"}
          </Card.Title>

          <UniversalForm
            fields={fields}
            formData={formData}
            error={error}
            success={message}
            onChange={handleChange}
            onSubmit={handleSubmit}
            buttonText={
              editingSpecialityId ? "Update speciality" : "Add speciality"
            }
            loading={loading}
            loadingText="Saving..."
          />

          {editingSpecialityId && (
            <Button
              variant="secondary"
              className="mt-2"
              onClick={resetForm}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>Specialities</Card.Title>

          <ListTable
            columns={columns}
            items={specialities}
            loading={loading}
            emptyMessage="No specialities found."
          />
        </Card.Body>
      </Card>
    </PageLayout>
  );
}

export default AdminSpecialitiesPage;
