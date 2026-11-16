import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentForm from "../../components/appointment/AppointmentForm";
import PageLayout from "../../layouts/PageLayout";

import { getDoctors, getAvailableTimes } from "../../services/doctorsApi";
import { getClinics } from "../../services/clinicsApi";
import { getSpecialities } from "../../services/specialitiesApi";
import { createGuestAppointment } from "../../services/appointmentsApi";


function GuestBookingPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthdate: "",
    gender: "",
    clinicId: "",
    specialityId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentDateTime: "",
    durationMinutes: 30,
    messageToDoctor: "",
  });

  const [clinics, setClinics] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTimes, setLoadingTimes] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [doctorsData, clinicsData, specialitiesData] = await Promise.all([
          getDoctors(),
          getClinics(),
          getSpecialities(),
        ]);

        setDoctors(doctorsData);
        setClinics(clinicsData);
        setSpecialities(specialitiesData);
      } catch (err) {
        console.error(err);
        setError("Could not load booking data.");
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchAvailableTimes() {
      if (
        !formData.doctorId ||
        !formData.appointmentDate ||
        !formData.durationMinutes
      ) {
        setAvailableTimes([]);
        return;
      }

      try {
        setLoadingTimes(true);
        setError("");

        const data = await getAvailableTimes(
          formData.doctorId,
          formData.appointmentDate,
          formData.durationMinutes,
        );

        setAvailableTimes(data);
      } catch (err) {
        console.error(err);
        setAvailableTimes([]);
        setError("Could not load available times.");
      } finally {
        setLoadingTimes(false);
      }
    }

    fetchAvailableTimes();
  }, [formData.doctorId, formData.appointmentDate, formData.durationMinutes]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "clinicId" ? { specialityId: "" } : {}),

      ...(name === "clinicId" || name === "specialityId"
        ? {
            doctorId: "",
            appointmentDate: "",
            appointmentDateTime: "",
          }
        : {}),

      ...(name === "doctorId"
        ? {
            appointmentDate: "",
            appointmentDateTime: "",
          }
        : {}),

      ...(name === "appointmentDate" || name === "durationMinutes"
        ? {
            appointmentDateTime: "",
          }
        : {}),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const appointment = await createGuestAppointment(formData);

      setSuccess("Appointment booked successfully.");

      navigate("/appointment/success", {
        state: { appointment },
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
      title="Book an Appointment"
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
        success={success}
        loading={loading || loadingTimes}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </PageLayout>
  );
}

export default GuestBookingPage;
