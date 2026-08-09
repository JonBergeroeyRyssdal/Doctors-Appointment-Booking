export function saveAdminAuth(data) {
  localStorage.setItem("adminToken", data.token);
  localStorage.setItem("adminRole", data.role);
  localStorage.setItem("adminUsername", data.username);
}

export function getAdminToken() {
  return localStorage.getItem("adminToken");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function removeAdminAuth() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminRole");
  localStorage.removeItem("adminUsername");
}

export function logoutPatient() {
  localStorage.removeItem("token");
  localStorage.removeItem("patient");
}

export function logoutAdmin() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminRole");
  localStorage.removeItem("adminUsername");
}
