import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";

import PageLayout from "../../layouts/PageLayout";
import AppointmentForm from "../../components/appointment/AppointmentForm";
import ConfirmModal from "../../components/ui/ConfirmModal";

import { getDoctors, getAvailableTimes } from "../../services/doctorsApi";
import { getClinics } from "../../services/clinicsApi";
import { getSpecialities } from "../../services/specialitiesApi";
import {
  updateAppointment,
  getAppointmentById,
} from "../../services/appointmentsApi";

import {
  buildUpdateAppointmentFormData,
  buildUpdateAppointmentPayload,
} from "../../utils/appointmentUtils";

function PatientUpdateAppointmentPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(
    location.state?.appointment || null,
  );

  const [clinics, setClinics] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);

  const [formData, setFormData] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    loadAppointment();
    loadFormData();
  }, []);

  useEffect(() => {
    if (!formData) {
      return;
    }

    loadAvailableTimes();
  }, [formData]);

  async function loadAppointment() {
    try {
      const data = await getAppointmentById(id);

      setAppointment(data);
      setFormData(buildUpdateAppointmentFormData(data));
    } catch (error) {
      console.error(error);
      navigate("/patient/appointments");
    } finally {
      setPageLoading(false);
    }
  }

  async function loadFormData() {
    try {
      const [clinicsData, specialitiesData, doctorsData] = await Promise.all([
        getClinics(),
        getSpecialities(),
        getDoctors(),
      ]);

      setClinics(clinicsData);
      setSpecialities(specialitiesData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error(error);
      setError("Could not load form data.");
    }
  }

  async function loadAvailableTimes() {
    if (
      !formData.doctorId ||
      !formData.appointmentDate ||
      !formData.durationMinutes
    ) {
      setAvailableTimes([]);
      return;
    }

    try {
      const data = await getAvailableTimes(
        formData.doctorId,
        formData.appointmentDate,
        formData.durationMinutes,
      );

      setAvailableTimes(data);
    } catch (error) {
      console.error(error);
      setAvailableTimes([]);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "doctorId" ||
      name === "appointmentDate" ||
      name === "durationMinutes"
        ? { appointmentDateTime: "" }
        : {}),
    }));
  }

  function handleCancelUpdate() {
    navigate("/patient/appointments");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setShowUpdateConfirm(true);
  }

  async function confirmUpdateAppointment() {
    setError("");
    setLoading(true);

    try {
      const payload = buildUpdateAppointmentPayload(formData);

      const updatedAppointment = await updateAppointment(id, payload);

      navigate("/patient/appointments/update-success", {
        state: {
          appointment: updatedAppointment,
        },
      });
    } catch (error) {
      console.error(error);
      setError(error.message || "Could not update appointment.");
    } finally {
      setLoading(false);
      setShowUpdateConfirm(false);
    }
  }

  if (pageLoading) {
    return (
      <PageLayout title="Loading appointment" size="medium">
        <p>Loading appointment...</p>
      </PageLayout>
    );
  }

  if (!formData) {
    return null;
  }

  return (
    <PageLayout
      title="Update appointment"
      subtitle="Choose a new time or update your appointment details."
      size="medium"
    >
      <AppointmentForm
        mode="patient"
        formData={formData}
        clinics={clinics}
        specialities={specialities}
        doctors={doctors}
        availableTimes={availableTimes}
        error={error}
        success=""
        loading={loading}
        onChange={handleChange}
        onSubmit={handleSubmit}
        buttonText="Update appointment"
      />

      <div className="d-flex justify-content-center mt-3">
        <Button
          type="button"
          variant="outline-secondary"
          onClick={() => setShowCancelConfirm(true)}
        >
          Cancel
        </Button>
      </div>

      <ConfirmModal
        show={showUpdateConfirm}
        onClose={() => setShowUpdateConfirm(false)}
        onConfirm={confirmUpdateAppointment}
        title="Update appointment"
        message="Are you sure you want to update this appointment?"
        confirmText="Yes, update"
        confirmVariant="primary"
      />

      <ConfirmModal
        show={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={handleCancelUpdate}
        title="Cancel update"
        message="Are you sure you want to cancel? Your changes will not be saved."
        confirmText="Yes, cancel"
      />
    </PageLayout>
  );
}

export default PatientUpdateAppointmentPage;
