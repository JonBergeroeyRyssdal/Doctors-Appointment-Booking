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
  return (
    <UniversalForm
      fields={fields}
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
