import { API_BASE_URL } from "./api";

export async function createPatientAppointment(appointmentData) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("You must be logged in to book an appointment.");
  }

  const response = await fetch(`${API_BASE_URL}/appointments/patient`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(appointmentData),
  });

  const responseText = await response.text();

  let data = {};

  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    console.error("Backend returned non-JSON:", responseText);

    throw new Error(responseText || "Backend returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Could not book appointment.");
  }

  return data;
}

export async function createGuestAppointment(appointmentData) {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointmentData),
  });

  console.log("Response status:", response.status);

  const responseText = await response.text();

  console.log("Raw response text:", responseText);

  let data = {};

  try {
    data = responseText ? JSON.parse(responseText) : {};

    console.log("Parsed JSON:", data);
  } catch {
    console.error("Invalid JSON from backend");
    throw new Error("Backend returned invalid JSON.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Could not book appointment.");
  }

  return data;
}

export async function getMyAppointments() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("You must be logged in to view your appointments.");
  }

  const response = await fetch(`${API_BASE_URL}/appointments/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Could not fetch appointments.");
  }

  return await response.json();
}

export async function cancelAppointment(id) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("You must be logged in to cancel an appointment.");
  }

  const response = await fetch(`${API_BASE_URL}/appointments/${id}/cancel`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Could not cancel appointment.");
  }

  return response.json();
}

export async function updateAppointment(id, formData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Could not update appointment.");
  }

  return await response.json();
}

export async function getAppointmentById(id) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("You must be logged in to view this appointment.");
  }

  const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Appointment not found.");
  }

  return await response.json();
}
