import UniversalForm from "./UniversalForm";
import AccountLayout from "../../layouts/AccountLayout";

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
  mode = "patient",
}) {
  const fields = [
    {
      name: identifierName,
      label: identifierLabel,
      type: identifierType,
      placeholder: identifierPlaceholder,
      required: true,
      autoComplete: identifierType === "email" ? "email" : "username",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
      autoComplete: "current-password",
      required: true,
    },
  ];

  return (
    <AccountLayout
      title={title}
      subtitle={subtitle}
      mode={mode}
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
    </AccountLayout>
  );
}

export default LoginForm;
