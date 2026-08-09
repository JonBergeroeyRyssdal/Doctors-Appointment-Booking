export function filterDoctors(doctors, clinicId, specialityId) {
  return doctors.filter((doctor) => {
    const matchesClinic = clinicId
      ? doctor.clinicId === Number(clinicId)
      : true;

    const matchesSpeciality = specialityId
      ? doctor.specialityId === Number(specialityId)
      : true;

    return matchesClinic && matchesSpeciality;
  });
}

export function validateGuestAppointmentForm(formData) {
  if (
    !formData.firstName ||
    !formData.lastName ||
    !formData.email ||
    !formData.birthdate ||
    !formData.clinicId ||
    !formData.specialityId ||
    !formData.doctorId ||
    !formData.durationMinutes ||
    !formData.appointmentDate ||
    !formData.appointmentDateTime
  ) {
    return "Please fill in all required fields.";
  }

  if (new Date(formData.appointmentDateTime) < new Date()) {
    return "Appointment date cannot be in the past.";
  }

  return "";
}

export function buildGuestAppointmentPayload(formData) {
  return {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    birthdate: formData.birthdate,
    clinicId: Number(formData.clinicId),
    specialityId: Number(formData.specialityId),
    doctorId: Number(formData.doctorId),
    appointmentDateTime: formData.appointmentDateTime,
    durationMinutes: Number(formData.durationMinutes),
    messageToDoctor: formData.messageToDoctor,
  };
}

export function validatePatientAppointmentForm(formData) {
  if (
    !formData.clinicId ||
    !formData.specialityId ||
    !formData.doctorId ||
    !formData.durationMinutes ||
    !formData.appointmentDateTime
  ) {
    return "Please fill in all required fields.";
  }

  if (new Date(formData.appointmentDateTime) < new Date()) {
    return "Appointment date cannot be in the past.";
  }

  return "";
}

export function buildPatientAppointmentPayload(formData) {
  return {
    clinicId: Number(formData.clinicId),
    specialityId: Number(formData.specialityId),
    doctorId: Number(formData.doctorId),
    appointmentDateTime: formData.appointmentDateTime,
    durationMinutes: Number(formData.durationMinutes),
    messageToDoctor: formData.messageToDoctor,
  };
}

export function buildUpdateAppointmentFormData(appointment) {
  return {
    clinicId: appointment?.clinicId || "",
    specialityId: appointment?.specialityId || "",
    doctorId: appointment?.doctorId || "",
    appointmentDate: appointment?.appointmentDateTime
      ? appointment.appointmentDateTime.split("T")[0]
      : "",
    durationMinutes: appointment?.durationMinutes || "",
    appointmentDateTime: appointment?.appointmentDateTime || "",
    messageToDoctor: appointment?.messageToDoctor || "",
  };
}

export function buildUpdateAppointmentPayload(formData) {
  return {
    clinicId: Number(formData.clinicId),
    specialityId: Number(formData.specialityId),
    doctorId: Number(formData.doctorId),
    appointmentDateTime: formData.appointmentDateTime,
    durationMinutes: Number(formData.durationMinutes),
    messageToDoctor: formData.messageToDoctor,
  };
}
