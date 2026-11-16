import { useEffect, useRef, useState } from "react";
import UniversalForm from "../forms/UniversalForm";
import { formatDateForInput } from "../../utils/dateUtils";

function AppointmentForm({
  mode = "guest",
  formData,
  clinics = [],
  specialities = [],
  doctors = [],
  availableTimes = [],
  existingAppointment,
  error,
  success,
  loading,
  onChange,
  onSubmit,
  buttonText = "Book appointment",
}) {
  const isGuest = mode === "guest";
  const [step, setStep] = useState(0);
  const [stepError, setStepError] = useState("");
  const headingRef = useRef(null);
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) headingRef.current?.focus();
    mounted.current = true;
  }, [step]);

  const selectedClinicId = Number(formData.clinicId);
  const selectedSpecialityId = Number(formData.specialityId);

  const doctorsForClinic = doctors.filter(
    (doctor) => Number(doctor.clinicId) === selectedClinicId,
  );

  const specialitiesForClinic = specialities.filter((speciality) =>
    doctorsForClinic.some(
      (doctor) => Number(doctor.specialityId) === Number(speciality.id),
    ),
  );

  const doctorList = doctors.filter((doctor) => {
    const sameClinic = Number(doctor.clinicId) === selectedClinicId;
    const sameSpeciality =
      selectedSpecialityId &&
      Number(doctor.specialityId) === selectedSpecialityId;

    return sameClinic && sameSpeciality;
  });

  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2);

  const minAppointmentDate = formatDateForInput(today);
  const maxAppointmentDate = formatDateForInput(maxDate);

  const fields = [
    ...(isGuest
      ? [
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
            name: "email",
            label: "Email",
            type: "email",
            required: true,
          },
          {
            name: "birthdate",
            label: "Date of birth",
            type: "date",
          },
        ]
      : []),

    {
      name: "clinicId",
      label: "Clinic",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Choose clinic" },
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
        {
          value: "",
          label: formData.clinicId
            ? "Choose speciality"
            : "Choose clinic first",
        },
        ...specialitiesForClinic.map((speciality) => ({
          value: speciality.id,
          label: speciality.name,
        })),
      ],
    },
    {
      name: "doctorId",
      label: "Doctor",
      type: "select",
      required: true,
      options: [
        {
          value: "",
          label:
            formData.clinicId && formData.specialityId
              ? "Choose doctor"
              : "Choose clinic and speciality first",
        },
        ...doctorList.map((doctor) => ({
          value: doctor.id,
          label: `Dr. ${doctor.firstName} ${doctor.lastName}${
            doctor.specialityName ? ` - ${doctor.specialityName}` : ""
          }`,
        })),
      ],
    },
    {
      name: "appointmentDate",
      label: "Appointment date",
      type: "date",
      required: true,
      min: minAppointmentDate,
      max: maxAppointmentDate,
    },
    {
      name: "durationMinutes",
      label: "Duration",
      type: "select",
      required: true,
      options: [
        { value: "", label: "Choose duration" },
        { value: 15, label: "15 minutes" },
        { value: 30, label: "30 minutes" },
        { value: 45, label: "45 minutes" },
        { value: 60, label: "60 minutes" },
      ],
    },
    {
      name: "appointmentDateTime",
      label: "Available time",
      type: "select",
      required: true,
      options: [
        {
          value: "",
          label:
            formData.doctorId &&
            formData.appointmentDate &&
            formData.durationMinutes
              ? "Choose available time"
              : "Choose doctor, date and duration first",
        },
        ...availableTimes.map((time) => ({
          value: time.appointmentDateTime,
          label: `${time.displayTime} - ${time.endTime}`,
        })),
        ...(existingAppointment &&
          formData.appointmentDateTime === existingAppointment.appointmentDateTime &&
          Number(formData.doctorId) === Number(existingAppointment.doctorId) &&
          Number(formData.durationMinutes) === Number(existingAppointment.durationMinutes) &&
          !availableTimes.some((time) => time.appointmentDateTime === formData.appointmentDateTime)
          ? [{ value: formData.appointmentDateTime, label: `${existingAppointment.displayTime || formData.appointmentDateTime.slice(11, 16)} (current appointment)` }]
          : []),
      ],
    },
    {
      name: "messageToDoctor",
      label: "Message to doctor",
      type: "textarea",
      rows: 3,
      maxLength: 100,
      placeholder: "Optional short message",
      helpText: `${formData.messageToDoctor?.length || 0}/100 characters`,
    },
  ];

  const providerNames = ["clinicId", "specialityId", "doctorId"];
  const timeNames = ["appointmentDate", "durationMinutes", "appointmentDateTime"];
  const steps = ["Choose provider", "Choose time", "Review & confirm"];
  const visibleFields = fields.filter((field) => step === 0
    ? providerNames.includes(field.name)
    : step === 1
      ? timeNames.includes(field.name)
      : !providerNames.includes(field.name) && !timeNames.includes(field.name));

  function handleStepSubmit(event) {
    event.preventDefault();
    if (loading) return;
    setStepError("");
    if (step === 0 && (providerNames.some((name) => !formData[name]) ||
      !doctorList.some((item) => Number(item.id) === Number(formData.doctorId)))) {
      setStepError("Please choose a clinic, speciality and doctor.");
      return;
    }
    if (step === 1 && timeNames.some((name) => !formData[name])) {
      setStepError("Please choose a date, duration and available time.");
      return;
    }
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    if (providerNames.some((name) => !formData[name])) {
      setStepError("Please choose a clinic, speciality and doctor.");
      setStep(0);
      return;
    }
    if (timeNames.some((name) => !formData[name])) {
      setStepError("Please choose a date, duration and available time.");
      setStep(1);
      return;
    }
    onSubmit(event);
  }

  const clinic = clinics.find((item) => Number(item.id) === Number(formData.clinicId));
  const speciality = specialities.find((item) => Number(item.id) === Number(formData.specialityId));
  const doctor = doctors.find((item) => Number(item.id) === Number(formData.doctorId));
  const dateTime = formData.appointmentDateTime ? new Date(formData.appointmentDateTime) : null;

  return (
    <div className="booking-wizard">
      <ol className="booking-steps" aria-label="Booking progress">
        {steps.map((label, index) => (
          <li key={label} className={index === step ? "is-current" : index < step ? "is-complete" : ""} aria-current={index === step ? "step" : undefined}>
            <span className="booking-step-number" aria-hidden="true">{index < step ? "✓" : index + 1}</span>
            <span>{label}</span>
          </li>
        ))}
      </ol>
      <h2 className="h5 booking-step-heading" ref={headingRef} tabIndex={-1}>
        {steps[step]}
      </h2>
      <p className="text-muted small mb-0">
        {step === 0 ? "Choose where and with whom you would like your appointment."
          : step === 1 ? "Choose a date and duration, then pick an available time."
            : isGuest ? "Check your appointment and enter your contact details below."
              : "Check your appointment details before submitting."}
      </p>
      <UniversalForm
        key={step}
        fields={visibleFields}
        formData={formData}
        error={stepError || error}
        success={success}
        loading={loading}
        loadingText={step < 2 ? "Loading times..." : "Saving..."}
        buttonText={step < 2 ? "Continue" : buttonText}
        onChange={onChange}
        onSubmit={handleStepSubmit}
        widthClass="w-100"
        secondaryAction={step > 0 && (
          <button type="button" className="btn btn-outline-secondary" disabled={loading} onClick={() => { setStepError(""); setStep(step - 1); }}>
            Back
          </button>
        )}
      >
        {step === 2 && (
          <section className="booking-summary" aria-label="Appointment summary">
            <h3 className="h6 mb-3">Your appointment</h3>
            <dl>
              <div><dt>Clinic</dt><dd>{clinic?.name || "Not selected"}</dd></div>
              <div><dt>Speciality</dt><dd>{speciality?.name || "Not selected"}</dd></div>
              <div><dt>Doctor</dt><dd>{doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : "Not selected"}</dd></div>
              <div><dt>Date & time</dt><dd>{dateTime && !Number.isNaN(dateTime.getTime()) ? dateTime.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "Not selected"}</dd></div>
              <div><dt>Duration</dt><dd>{formData.durationMinutes} minutes</dd></div>
            </dl>
            <button type="button" className="btn btn-link p-0" disabled={loading} onClick={() => setStep(0)}>Edit appointment details</button>
          </section>
        )}
      </UniversalForm>
    </div>
  );
}

export default AppointmentForm;
