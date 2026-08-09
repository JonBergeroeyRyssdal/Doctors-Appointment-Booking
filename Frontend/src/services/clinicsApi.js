import { API_BASE_URL } from "./api";

export async function getClinics() {
  const response = await fetch(`${API_BASE_URL}/clinics`);

  if (!response.ok) {
    throw new Error("Could not fetch clinics.");
  }

  return await response.json();
}

export async function createClinic(clinicData) {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(`${API_BASE_URL}/clinics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(clinicData),
  });

  if (!response.ok) {
    throw new Error("Could not create clinic.");
  }

  return await response.json();
}

export async function updateClinic(id, clinicData) {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(`${API_BASE_URL}/clinics/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(clinicData),
  });

  if (!response.ok) {
    throw new Error("Could not update clinic.");
  }

  return;
}

export async function deleteClinic(id) {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(`${API_BASE_URL}/clinics/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Could not delete clinic.");
  }

  return;
}
