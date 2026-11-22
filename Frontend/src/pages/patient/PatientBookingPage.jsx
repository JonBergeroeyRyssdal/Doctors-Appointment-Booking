import useAppointmentBooking from "../../hooks/useAppointmentBooking";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentForm from "../../components/appointment/AppointmentForm";
import PageLayout from "../../layouts/PageLayout";
import { createPatientAppointment } from "../../services/appointmentsApi";
import {
  validatePatientAppointmentForm,
  buildPatientAppointmentPayload,
} from "../../utils/appointmentUtils";

function PatientBookingPage() {
  const navigate = useNavigate();

  const {
    formData, clinics, specialities, doctors, availableTimes,
    error, setError, handleChange, loadingBooking,
  } = useAppointmentBooking();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event, paymentDemo) {
    event.preventDefault();

    setError("");

    const validationError = validatePatientAppointmentForm(formData);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const payload = buildPatientAppointmentPayload(formData);

      const bookedAppointment = await createPatientAppointment(payload);

      navigate("/patient/book/success", {
        state: {
          appointment: bookedAppointment,
          paymentDemo,
        },
      });
    } catch (error) {
      console.error(error);
      setError(error.message || "Could not book appointment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout
      title="Book an appointment"
      eyebrow="Appointments"
      subtitle="Choose an available appointment time."
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
        loading={loading || loadingBooking}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </PageLayout>
  );
}

export default PatientBookingPage;
