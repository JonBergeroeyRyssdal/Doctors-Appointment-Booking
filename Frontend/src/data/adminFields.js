export function getAdminFields(isEditing) {
  return [
    {
      name: "username",
      label: "Username",
      type: "text",
      placeholder: "Enter username",
      required: true,
    },
    {
      name: "password",
      label: isEditing ? "New password (optional)" : "Password",
      type: "password",
      placeholder: isEditing
        ? "Leave empty to keep current password"
        : "Enter password",
      required: !isEditing,
    },
  ];
}
