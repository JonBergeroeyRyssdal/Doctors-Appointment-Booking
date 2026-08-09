import { API_BASE_URL } from "./api";

function getAdminToken() {
  return localStorage.getItem("adminToken");
}

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAdminToken()}`,
  };
}

export async function getAdmins() {
  const response = await fetch(`${API_BASE_URL}/admins`, {
    headers: {
      Authorization: `Bearer ${getAdminToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Could not fetch admins.");
  }

  return await response.json();
}

export async function createAdmin(adminData) {
  const response = await fetch(`${API_BASE_URL}/admins`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(adminData),
  });

  if (!response.ok) {
    throw new Error("Could not create admin.");
  }

  return await response.json();
}

export async function updateAdmin(id, adminData) {
  const response = await fetch(`${API_BASE_URL}/admins/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(adminData),
  });

  if (!response.ok) {
    throw new Error("Could not update admin.");
  }

  return await response.json();
}

export async function deleteAdmin(id) {
  const response = await fetch(`${API_BASE_URL}/admins/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.log("DELETE ERROR:", errorText);

    throw new Error(errorText);
  }
}
