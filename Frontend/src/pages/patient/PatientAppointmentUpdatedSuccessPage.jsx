import { useLocation } from "react-router-dom";
import AppointmentSuccess from "../../components/appointment/AppointmentSuccess";

function PatientAppointmentUpdatedSuccessPage() {
  const location = useLocation();
  const appointment = location.state?.appointment;

  return (
    <AppointmentSuccess
      appointment={appointment}
      title="Appointment successfully updated"
      primaryButtonText="View my appointments"
      primaryButtonTo="/patient/appointments"
      secondaryButtonText="Go to patient dashboard"
      secondaryButtonTo="/patient/dashboard"
    />
  );
}

export default PatientAppointmentUpdatedSuccessPage;
