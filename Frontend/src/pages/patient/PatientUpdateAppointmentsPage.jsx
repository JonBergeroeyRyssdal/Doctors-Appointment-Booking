import useAppointmentBooking from "../../hooks/useAppointmentBooking";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";

import PageLayout from "../../layouts/PageLayout";
import AppointmentForm from "../../components/appointment/AppointmentForm";
import ConfirmModal from "../../components/ui/ConfirmModal";

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

  const {
    formData, setFormData, clinics, specialities, doctors, availableTimes,
    error, setError, handleChange, loadingBooking,
  } = useAppointmentBooking({ editing: true });

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);


  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadAppointment() {
      try {
        const data = await getAppointmentById(id);
        if (active) {
          setAppointment(data);
          setFormData(buildUpdateAppointmentFormData(data));
        }
      } catch (error) {
        console.error(error);
        if (active) navigate("/patient/appointments");
      } finally {
        if (active) setPageLoading(false);
      }
    }
    loadAppointment();
    return () => { active = false; };
  }, [id, navigate, setFormData]);

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
        existingAppointment={appointment}
        paymentDemo={false}
        error={error}
        success=""
        loading={loading || loadingBooking}
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
