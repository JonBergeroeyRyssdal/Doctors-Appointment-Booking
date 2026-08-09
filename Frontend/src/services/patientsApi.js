import { API_BASE_URL } from "./api";
import { getToken } from "./authStorage";

export async function getPatients() {
  const response = await fetch(`${API_BASE_URL}/patients`);

  if (!response.ok) {
    throw new Error("Could not fetch patients.");
  }

  return await response.json();
}

export async function getPatientById(id) {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Could not fetch patient.");
  }

  return await response.json();
}

export async function createPatient(patientData) {
  const response = await fetch(`${API_BASE_URL}/patients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patientData),
  });

  if (!response.ok) {
    throw new Error("Could not create patient.");
  }

  return await response.json();
}

export async function updatePatient(id, patientData) {
  const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patientData),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(responseText || "Could not update patient.");
  }

  return responseText ? JSON.parse(responseText) : null;
}

export async function deletePatient(id) {
  const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Could not delete patient.");
  }
}

export async function getLoggedInPatient() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found.");
  }

  const response = await fetch(`${API_BASE_URL}/patients/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("PATIENT ME ERROR:", errorText);
    throw new Error("Could not fetch patient information");
  }

  return await response.json();
}
