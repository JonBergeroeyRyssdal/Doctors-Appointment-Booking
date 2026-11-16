import RegisterForm from "../../components/forms/RegisterForm";
import AccountLayout from "../../layouts/AccountLayout";

function RegisterPage() {
  return (
    <AccountLayout
      title="Create your account"
      subtitle="Enter your details below. Additional information is optional."
      mode="register"
    >
      <RegisterForm />
    </AccountLayout>
  );
}

export default RegisterPage;
