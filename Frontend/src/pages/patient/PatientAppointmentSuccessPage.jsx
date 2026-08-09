import { useLocation } from "react-router-dom";
import AppointmentSuccess from "../../components/Appointment/AppointmentSuccess";

function PatientAppointmentSuccessPage() {
  const location = useLocation();
  const appointment = location.state?.appointment;

  return (
    <AppointmentSuccess
      appointment={appointment}
      primaryButtonText="Book another appointment"
      primaryButtonTo="/patient/book"
      secondaryButtonText={"Go to patient dashboard"}
      secondaryButtonTo={"/patient/dashboard"}
    />
  );
}

export default PatientAppointmentSuccessPage;
