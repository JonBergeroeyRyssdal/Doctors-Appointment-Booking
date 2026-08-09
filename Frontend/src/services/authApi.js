import { API_BASE_URL } from "./api";

export async function loginAdmin(formData) {
  const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("Invalid admin credentials.");
  }

  return await response.json();
}

export async function loginPatient(formData) {
  const response = await fetch(`${API_BASE_URL}/auth/patient-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not log in.");
  }

  return data;
}
