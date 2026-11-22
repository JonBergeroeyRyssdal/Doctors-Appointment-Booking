import useAppointmentBooking from "../../hooks/useAppointmentBooking";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentForm from "../../components/appointment/AppointmentForm";
import PageLayout from "../../layouts/PageLayout";

import { createGuestAppointment } from "../../services/appointmentsApi";


function GuestBookingPage() {
  const navigate = useNavigate();

  const {
    formData, clinics, specialities, doctors, availableTimes,
    error, setError, handleChange, loadingBooking,
  } = useAppointmentBooking({ guest: true });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e, paymentDemo) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const appointment = await createGuestAppointment(formData);


      navigate("/appointment/success", {
        state: { appointment, paymentDemo },
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not book appointment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout
      title="Book an appointment"
      eyebrow="Appointments"
      subtitle="Fill in your information and choose an available time."
      size="medium"
    >
      <AppointmentForm
        mode="guest"
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

export default GuestBookingPage;
