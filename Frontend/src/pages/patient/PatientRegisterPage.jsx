import RegisterForm from "../../components/forms/RegisterForm";
import PageLayout from "../../layouts/PageLayout";

function RegisterPage() {
  return (
    <PageLayout
      title="Register"
      subtitle="Create a patient account to manage appointments."
      size="small"
    >
      <RegisterForm />
    </PageLayout>
  );
}

export default RegisterPage;
