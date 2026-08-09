import SuccessMessage from "../../components/ui/SuccessMessage";

function RegisterSuccessPage() {
  return (
    <SuccessMessage
      title="Registration successful"
      message="Your patient account has been created successfully."
      primaryButtonText="Go to login"
      primaryButtonTo="/login"
    />
  );
}

export default RegisterSuccessPage;
