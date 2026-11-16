import { Link } from "react-router-dom";
import ManagementPanel from "../../components/ui/ManagementPanel";
import { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";

import PageLayout from "../../layouts/PageLayout";
import ListTable from "../../components/ui/ListTable";
import UniversalForm from "../../components/forms/UniversalForm";

import { getClinics } from "../../services/clinicsApi";
import { getSpecialities } from "../../services/specialitiesApi";

import { doctorColumns } from "../../data/doctorColumns.jsx";

import {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../../services/doctorsApi";

function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [specialities, setSpecialities] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    clinicId: "",
    specialityId: "",
  });

  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    try {
      setLoading(true);

      const [doctorsData, clinicsData, specialitiesData] = await Promise.all([
        getDoctors(),
        getClinics(),
        getSpecialities(),
      ]);

      setDoctors(doctorsData);
      setClinics(clinicsData);
      setSpecialities(specialitiesData);
    } catch (error) {
      console.error(error);
      setError("Could not load data.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchAllDoctors() {
    try {
      const data = await getDoctors();
      setDoctors(data);
    } catch (error) {
      console.error(error);
      setError("Could not load doctors.");
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

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.clinicId ||
      !formData.specialityId
    ) {
      setError("Doctor fields are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const doctorPayload = {
        id: editingDoctorId ?? 0,
        firstName: formData.firstName,
        lastName: formData.lastName,
        clinicId: Number(formData.clinicId),
        specialityId: Number(formData.specialityId),
      };

      if (editingDoctorId) {
        await updateDoctor(editingDoctorId, doctorPayload);
      } else {
        await createDoctor(doctorPayload);
      }

      setMessage(
        editingDoctorId
          ? "Doctor updated successfully."
          : "Doctor added successfully.",
      );

      resetForm();
      fetchAllDoctors();
    } catch (error) {
      console.error(error);
      setError("Could not save doctor.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(doctor) {
    setEditingDoctorId(doctor.id);

    setFormData({
      firstName: doctor.firstName || "",
      lastName: doctor.lastName || "",
      clinicId: doctor.clinicId || "",
      specialityId: doctor.specialityId || "",
    });

    setError("");
    setMessage("");
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this doctor?",
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await deleteDoctor(id);

      setMessage("Doctor deleted successfully.");

      fetchAllDoctors();
    } catch (error) {
      console.error(error);
      setError(
        "Could not delete doctor. It may have appointments connected to it.",
      );
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingDoctorId(null);

    setFormData({
      firstName: "",
      lastName: "",
      clinicId: "",
      specialityId: "",
    });
  }

  const doctorFields = [
    {
      name: "firstName",
      label: "First name",
      type: "text",
      required: true,
    },
    {
      name: "lastName",
      label: "Last name",
      type: "text",
      required: true,
    },
    {
      name: "clinicId",
      label: "Clinic",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select clinic" },
        ...clinics.map((clinic) => ({
          value: clinic.id,
          label: clinic.name,
        })),
      ],
    },
    {
      name: "specialityId",
      label: "Speciality",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Select speciality" },
        ...specialities.map((speciality) => ({
          value: speciality.id,
          label: speciality.name,
        })),
      ],
    },
  ];

  return (
    <PageLayout
      title="Manage doctors"
      subtitle="View, add, edit and delete doctors."
      eyebrow="Clinic administration"
      actions={<Link className="btn btn-outline-secondary" to="/admin/dashboard">Back to dashboard</Link>}
      size="wide"
    >
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="management-layout">
        <ManagementPanel kind="form" icon="doctor" title={editingDoctorId ? "Edit doctor" : "Add new doctor"} description="Set up a doctor and their clinic and speciality." editingId={editingDoctorId}>

          <UniversalForm
            fields={doctorFields}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            buttonText={editingDoctorId ? "Update doctor" : "Add doctor"}
            loading={loading}
            loadingText={editingDoctorId ? "Updating..." : "Saving..."}
          />

          {editingDoctorId && (
            <Button
              type="button"
              variant="outline-secondary"
              className="mt-3"
              onClick={resetForm}
            >
              Cancel
            </Button>
          )}
        </ManagementPanel>

        <ManagementPanel kind="list" icon="doctor" title="Doctors" description="Browse your directory and manage existing records." count={doctors.length} loading={loading}>

          <ListTable
            caption="Doctors"
            columns={doctorColumns(handleEdit, handleDelete)}
            items={doctors}
            loading={loading}
            emptyMessage="No doctors found."
          />
        </ManagementPanel>
      </div>
    </PageLayout>
  );
}

export default AdminDoctorsPage;
