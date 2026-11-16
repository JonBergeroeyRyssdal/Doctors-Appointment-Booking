import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentForm from "../../components/appointment/AppointmentForm";
import PageLayout from "../../layouts/PageLayout";
import { getDoctors, getAvailableTimes } from "../../services/doctorsApi";
import { getClinics } from "../../services/clinicsApi";
import { getSpecialities } from "../../services/specialitiesApi";
import { createPatientAppointment } from "../../services/appointmentsApi";
import {
  validatePatientAppointmentForm,
  buildPatientAppointmentPayload,
} from "../../utils/appointmentUtils";

function PatientBookingPage() {
  const navigate = useNavigate();

  const [clinics, setClinics] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTimes, setLoadingTimes] = useState(false);

  const [formData, setFormData] = useState({
    clinicId: "",
    specialityId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentDateTime: "",
    durationMinutes: 30,
    messageToDoctor: "",
  });

  useEffect(() => {
    async function loadData() {
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
        setError("Could not load appointment data.");
      }
    }

    loadData();
  }, []);

  useEffect(() => {
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
        setLoadingTimes(true);
        setError("");

        const times = await getAvailableTimes(
          formData.doctorId,
          formData.appointmentDate,
          formData.durationMinutes,
        );

        setAvailableTimes(times);
      } catch (error) {
        console.error(error);
        setAvailableTimes([]);
        setError("Could not load available appointment times.");
      } finally {
        setLoadingTimes(false);
      }
    }

    loadAvailableTimes();
  }, [formData.doctorId, formData.appointmentDate, formData.durationMinutes]);

  function handleChange(event) {
    const { name, value } = event.target;

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

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
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
      title="Book an Appointment"
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
        success={message}
        loading={loading || loadingTimes}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </PageLayout>
  );
}

export default PatientBookingPage;
