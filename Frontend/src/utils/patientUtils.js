// src/utils/patientUtils.js

export function getPatientValue(patient, lowerCaseKey, upperCaseKey) {
  return patient?.[lowerCaseKey] || patient?.[upperCaseKey] || "Not registered";
}

export function formatPatientDate(value) {
  if (!value) return "Not registered";

  return new Date(value).toLocaleDateString();
}
