import UniversalForm from "./UniversalForm";
import PageLayout from "../../layouts/PageLayout";

function LoginForm({
  title = "Login",
  subtitle = "",
  identifierLabel = "Email",
  identifierName = "email",
  identifierType = "email",
  identifierPlaceholder = "Enter email",
  formData,
  onChange,
  onSubmit,
  buttonText = "Login",
  loading = false,
  error = "",
}) {
  const fields = [
    {
      name: identifierName,
      label: identifierLabel,
      type: identifierType,
      placeholder: identifierPlaceholder,
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
      required: true,
    },
  ];

  return (
    <PageLayout
      title={title}
      subtitle={subtitle}
      size="small"
      loading={loading}
    >
      <UniversalForm
        fields={fields}
        formData={formData}
        error={error}
        onChange={onChange}
        onSubmit={onSubmit}
        buttonText={buttonText}
        loading={loading}
        loadingText="Logging in..."
        buttonVariant="primary"
      />
    </PageLayout>
  );
}

export default LoginForm;
