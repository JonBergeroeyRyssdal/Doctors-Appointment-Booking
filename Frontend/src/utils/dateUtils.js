export function formatDate(dateTime) {
  if (!dateTime) return "Not available";

  return new Date(dateTime).toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatTime(dateTime) {
  if (!dateTime) return "Not available";

  return new Date(dateTime).toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateForInput(date) {
  return date.toISOString().split("T")[0];
}
