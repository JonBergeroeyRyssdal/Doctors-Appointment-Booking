import { useLocation } from "react-router-dom";
import AppointmentSuccess from "../../components/appointment/AppointmentSuccess";

function GuestAppointmentSuccessPage() {
  const location = useLocation();
  const appointment = location.state?.appointment;

  return (
    <AppointmentSuccess
      appointment={appointment}
      primaryButtonText="Book another appointment"
      primaryButtonTo="/"
    />
  );
}

export default GuestAppointmentSuccessPage;
