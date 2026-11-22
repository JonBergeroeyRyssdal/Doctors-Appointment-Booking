import { useLocation } from "react-router-dom";
import AppointmentSuccess from "../../components/appointment/AppointmentSuccess";

function GuestAppointmentSuccessPage() {
  const location = useLocation();
  const appointment = location.state?.appointment;

  return (
    <AppointmentSuccess
      appointment={appointment}
      paymentDemo={location.state?.paymentDemo}
      primaryButtonText="Book another appointment"
      primaryButtonTo="/book"
      secondaryButtonText="Back to home"
      secondaryButtonTo="/"
    />
  );
}

export default GuestAppointmentSuccessPage;
