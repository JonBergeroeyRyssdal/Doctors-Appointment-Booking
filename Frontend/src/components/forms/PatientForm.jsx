import UniversalForm from "./UniversalForm";

import { registerFields } from "../../data/registerFields";

function PatientForm({
  fields = registerFields,
  formData,
  error,
  loading,
  onChange,
  onSubmit,
  buttonText = "Save",
  buttonVariant = "primary",
  loadingText = "Saving...",
}) {
  const select = (names) => fields.filter((field) => names.includes(field.name));
  const registering = fields.some((field) => field.name === "password");
  const sections = [
    {
      title: "Personal details",
      fields: select(registering
        ? ["firstName", "lastName"]
        : ["firstName", "lastName", "birthdate", "gender"]),
    },
    { title: "Contact information", fields: select(["email"]) },
    {
      title: registering ? "Additional information (optional)" : "Other information",
      description: registering ? "You can create your account without filling in these details." : "Identity and insurance details.",
      collapsible: registering,
      fields: fields.filter((field) => ![
        "firstName", "lastName", "email", "password", "confirmPassword",
        ...(!registering ? ["birthdate", "gender"] : []),
      ].includes(field.name)),
    },
    { title: "Account security", fields: select(["password", "confirmPassword"]) },
  ].filter((section) => section.fields.length > 0);

  return (
    <UniversalForm
      fields={fields}
      sections={sections}
      formData={formData}
      error={error}
      onChange={onChange}
      onSubmit={onSubmit}
      buttonText={buttonText}
      buttonVariant={buttonVariant}
      loading={loading}
      loadingText={loadingText}
    />
  );
}

export default PatientForm;
