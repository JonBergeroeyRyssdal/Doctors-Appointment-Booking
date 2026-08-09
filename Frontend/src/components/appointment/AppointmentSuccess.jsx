import { Alert } from "react-bootstrap";
import SuccessMessage from "../ui/SuccessMessage";
import { formatDate, formatTime } from "../../utils/dateUtils";

function AppointmentSuccess({
  appointment,
  title = "Appointment booked successfully",
  primaryButtonText,
  primaryButtonTo,
  secondaryButtonText,
  secondaryButtonTo,
}) {
  return (
    <SuccessMessage
      title={title}
      primaryButtonText={primaryButtonText}
      primaryButtonTo={primaryButtonTo}
      secondaryButtonText={secondaryButtonText}
      secondaryButtonTo={secondaryButtonTo}
    >
      {appointment ? (
        <div className="text-start mb-4 border rounded p-3 bg-light">
          <h5 className="mb-3">Appointment details</h5>

          <p>
            <strong>Date:</strong> {formatDate(appointment.appointmentDateTime)}
          </p>

          <p>
            <strong>Time:</strong>{" "}
            {appointment.displayTime ||
              formatTime(appointment.appointmentDateTime)}
            {" - "}
            {appointment.endTime || "Not available"} (
            {appointment.durationMinutes || 0} min)
          </p>

          <p>
            <strong>Doctor:</strong> {appointment.doctorName || "Not available"}
          </p>

          <p>
            <strong>Clinic:</strong> {appointment.clinicName || "Not available"}
          </p>

          <p>
            <strong>Speciality:</strong>{" "}
            {appointment.specialityName || "Not available"}
          </p>

          {appointment.messageToDoctor && (
            <p>
              <strong>Message to doctor:</strong> {appointment.messageToDoctor}
            </p>
          )}

          <p className="mb-0">
            <strong>Status:</strong> {appointment.status || "Booked"}
          </p>
        </div>
      ) : (
        <Alert variant="warning" className="text-start">
          Appointment details are not available. This can happen if you opened
          the success page directly or refreshed the page.
        </Alert>
      )}
    </SuccessMessage>
  );
}

export default AppointmentSuccess;
