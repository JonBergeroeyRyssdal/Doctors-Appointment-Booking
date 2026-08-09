import { API_BASE_URL } from "./api";

export async function getSpecialities() {
  const response = await fetch(`${API_BASE_URL}/specialities`);

  if (!response.ok) {
    throw new Error("Could not fetch specialities.");
  }

  return await response.json();
}

export async function createSpeciality(specialityData) {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(`${API_BASE_URL}/specialities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(specialityData),
  });

  if (!response.ok) {
    throw new Error("Could not create speciality.");
  }

  return await response.json();
}

export async function updateSpeciality(id, specialityData) {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(`${API_BASE_URL}/specialities/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(specialityData),
  });

  if (!response.ok) {
    throw new Error("Could not update speciality.");
  }

  return await response.json();
}

export async function deleteSpeciality(id) {
  const token = localStorage.getItem("adminToken");

  const response = await fetch(`${API_BASE_URL}/specialities/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Could not delete speciality.");
  }
}
