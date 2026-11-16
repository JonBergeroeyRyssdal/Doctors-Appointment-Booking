import { API_BASE_URL } from "./api";
import { getAdminToken } from "./authStorage";

export async function getDoctors() {
  const response = await fetch(`${API_BASE_URL}/doctors`);

  if (!response.ok) {
    throw new Error("Could not fetch doctors.");
  }

  return await response.json();
}

export async function createDoctor(doctorData) {
  const token = getAdminToken();

  const response = await fetch(`${API_BASE_URL}/doctors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(doctorData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Could not create doctor.");
  }

  return await response.json();
}

export async function updateDoctor(id, doctorData) {
  const token = getAdminToken();

  const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(doctorData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Could not update doctor.");
  }

  return;
}

export async function deleteDoctor(id) {
  const token = getAdminToken();

  const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Could not delete doctor.");
  }

  return;
}

export async function getAvailableTimes(doctorId, date, durationMinutes) {
  const response = await fetch(
    `${API_BASE_URL}/doctoravailabilities/available-times?doctorId=${doctorId}&date=${date}&durationMinutes=${durationMinutes}`,
  );

  if (!response.ok) {
    throw new Error("Could not fetch available times.");
  }

  return await response.json();
}

export async function searchDoctors(name, { signal } = {}) {
  const response = await fetch(
    `${API_BASE_URL}/doctors/search?name=${encodeURIComponent(name)}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error("Could not search doctors.");
  }

  return await response.json();
}
