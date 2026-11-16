import WelcomeComponent from "../../components/home/WelcomeComponent";
import PageLayout from "../../layouts/PageLayout";

function WelcomePage() {
  return (
    <PageLayout
      title="Clinic Appointment Booking"
      subtitle="Book an appointment with a doctor at one of our clinics. Continue as a guest, log in as an existing patient, or create a new patient account."
      size="large"
    >
      <WelcomeComponent />
    </PageLayout>
  );
}

export default WelcomePage;
