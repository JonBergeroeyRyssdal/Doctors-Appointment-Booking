import { useEffect, useState } from "react";
import { Alert, Button, Card } from "react-bootstrap";

import PageLayout from "../../layouts/PageLayout";
import ListTable from "../../components/ui/ListTable";
import UniversalForm from "../../components/forms/UniversalForm";

import { getAdminFields } from "../../data/adminFields";
import { getAdminColumns } from "../../data/adminColumns.jsx";

import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../../services/adminsApi";

function AdminAdminsPage() {
  const [admins, setAdmins] = useState([]);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [editingAdminId, setEditingAdminId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllAdmins();
  }, []);

  async function fetchAllAdmins() {
    try {
      setLoading(true);

      const data = await getAdmins();
      setAdmins(data);
    } catch (error) {
      console.error(error);
      setError("Could not load admins.");
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

    if (!formData.username.trim()) {
      setError("Username is required.");
      return;
    }

    if (!editingAdminId && !formData.password.trim()) {
      setError("Password is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      if (editingAdminId) {
        const updateData = {
          username: formData.username,
          ...(formData.password && {
            password: formData.password,
          }),
        };

        await updateAdmin(editingAdminId, updateData);

        setMessage("Admin updated successfully.");
      } else {
        await createAdmin(formData);

        setMessage("Admin created successfully.");
      }

      resetForm();
      fetchAllAdmins();
    } catch (error) {
      console.error(error);
      setError("Could not save admin.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(admin) {
    setEditingAdminId(admin.id);

    setFormData({
      username: admin.username || "",
      password: "",
    });

    setError("");
    setMessage("");
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this admin?",
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await deleteAdmin(id);

      setMessage("Admin deleted successfully.");

      fetchAllAdmins();
    } catch (error) {
      console.error(error);
      setError("Could not delete admin.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingAdminId(null);

    setFormData({
      username: "",
      password: "",
    });
  }

  const adminFields = getAdminFields(!!editingAdminId);
  const columns = getAdminColumns(handleEdit, handleDelete);

  return (
    <PageLayout
      title="Manage admins"
      subtitle="Create, update and delete administrator accounts."
      size="large"
    >
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>
            {editingAdminId ? "Edit admin" : "Add new admin"}
          </Card.Title>

          <UniversalForm
            fields={adminFields}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            buttonText={editingAdminId ? "Update admin" : "Create admin"}
            loading={loading}
            loadingText={editingAdminId ? "Updating..." : "Creating..."}
            buttonVariant="primary"
          />

          {editingAdminId && (
            <Button
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
          <Card.Title>Admins</Card.Title>

          <ListTable
            columns={columns}
            items={admins}
            loading={loading}
            emptyMessage="No admins found."
          />
        </Card.Body>
      </Card>
    </PageLayout>
  );
}

export default AdminAdminsPage;
