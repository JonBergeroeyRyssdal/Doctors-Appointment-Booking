import { useEffect, useState } from "react";
import { getDoctors, getAvailableTimes } from "../services/doctorsApi";
import { getClinics } from "../services/clinicsApi";
import { getSpecialities } from "../services/specialitiesApi";

export default function useAppointmentBooking({ guest = false, editing = false } = {}) {
  const [formData, setFormData] = useState(() => editing ? null : ({
    ...(guest ? { firstName: "", lastName: "", email: "", birthdate: "", gender: "" } : {}),
    clinicId: "", specialityId: "", doctorId: "", appointmentDate: "",
    appointmentDateTime: "", durationMinutes: 30, messageToDoctor: "",
  }));
  const [providers, setProviders] = useState({ clinics: [], specialities: [], doctors: [] });
  const [providerLoading, setProviderLoading] = useState(true);
  const [providerError, setProviderError] = useState("");
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState({ key: "", times: [], error: "" });
  const doctorId = formData?.doctorId;
  const date = formData?.appointmentDate;
  const duration = formData?.durationMinutes;
  const key = doctorId && date && duration ? JSON.stringify([doctorId, date, duration]) : "";

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [clinics, specialities, doctors] = await Promise.all([getClinics(), getSpecialities(), getDoctors()]);
        if (active) setProviders({ clinics, specialities, doctors });
      } catch (error) {
        console.error(error);
        if (active) setProviderError("Could not load appointment data.");
      } finally {
        if (active) setProviderLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!key) return;
    let active = true;
    async function load() {
      try {
        const times = await getAvailableTimes(doctorId, date, duration);
        if (active) setAvailability({ key, times, error: "" });
      } catch (error) {
        console.error(error);
        if (active) setAvailability({ key, times: [], error: "Could not load available appointment times." });
      }
    }
    load();
    return () => { active = false; };
  }, [key, doctorId, date, duration]);

  function handleChange(event) {
    const { name, value } = event.target;
    if (String(formData?.[name] ?? "") === value) return;
    if (["clinicId", "specialityId", "doctorId", "appointmentDate", "durationMinutes"].includes(name)) {
      setAvailability({ key: "", times: [], error: "" });
    }
    setFormData((previous) => ({
      ...previous, [name]: value,
      ...(name === "clinicId" ? { specialityId: "" } : {}),
      ...(["clinicId", "specialityId"].includes(name) ? { doctorId: "" } : {}),
      ...(!editing && ["clinicId", "specialityId", "doctorId"].includes(name) ? { appointmentDate: "" } : {}),
      ...(["clinicId", "specialityId", "doctorId", "appointmentDate", "durationMinutes"].includes(name) ? { appointmentDateTime: "" } : {}),
    }));
  }

  const current = availability.key === key;
  return {
    ...providers, formData, setFormData, handleChange, setError,
    error: error || providerError || (current ? availability.error : ""),
    availableTimes: current ? availability.times : [],
    loadingBooking: providerLoading || Boolean(key && !current),
  };
}
