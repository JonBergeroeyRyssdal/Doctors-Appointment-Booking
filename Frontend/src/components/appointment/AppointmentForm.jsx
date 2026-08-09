import UniversalForm from "../forms/UniversalForm";
import { formatDateForInput } from "../../utils/dateUtils";

function AppointmentForm({
  mode = "guest",
  formData,
  clinics = [],
  specialities = [],
  doctors = [],
  availableTimes = [],
  error,
  success,
  loading,
  onChange,
  onSubmit,
  buttonText = "Book appointment",
}) {
  const isGuest = mode === "guest";

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

  return (
    <UniversalForm
      fields={fields}
      formData={formData}
      error={error}
      success={success}
      loading={loading}
      loadingText="Booking..."
      buttonText={buttonText}
      buttonVariant="primary"
      onChange={onChange}
      onSubmit={onSubmit}
      widthClass="w-100"
    />
  );
}

export default AppointmentForm;
