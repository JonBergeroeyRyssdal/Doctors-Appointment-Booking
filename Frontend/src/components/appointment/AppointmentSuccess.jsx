import SuccessMessage from "../ui/SuccessMessage";
import { formatDate, formatTime } from "../../utils/dateUtils";
import { paymentMethods } from "../../data/paymentMethods";

function AppointmentSuccess({
  appointment,
  paymentDemo,
  title = "Your appointment is booked",
  primaryButtonText,
  primaryButtonTo,
  secondaryButtonText,
  secondaryButtonTo,
}) {
  const start = appointment?.appointmentDateTime;
  const startDate = start ? new Date(start) : null;
  const validDate = startDate && !Number.isNaN(startDate.getTime());
  const duration = Number(appointment?.durationMinutes);
  const end = validDate && duration > 0
    ? new Date(startDate.getTime() + duration * 60000).toISOString()
    : null;

  return (
    <SuccessMessage
      title={appointment ? title : "Appointment details unavailable"}
      message={appointment
        ? "Your appointment details are saved. Here is your summary."
        : "Open this page after booking to see your appointment summary."}
      confirmed={Boolean(appointment)}
      primaryButtonText={primaryButtonText}
      primaryButtonTo={primaryButtonTo}
      secondaryButtonText={secondaryButtonText}
      secondaryButtonTo={secondaryButtonTo}
    >
      {appointment && (
        <section className="confirmation-details" aria-labelledby="appointment-details-title">
          <div className="confirmation-details-heading">
            <h2 id="appointment-details-title">Appointment details</h2>
            <span className="confirmation-status">{appointment.status || "Booked"}</span>
          </div>
          <dl className="confirmation-schedule">
            <div>
              <dt>Date</dt>
              <dd>{validDate ? formatDate(start) : "Not available"}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{appointment.displayTime || (validDate ? formatTime(start) : "Not available")}
                {(appointment.endTime || end) && <> – {appointment.endTime || formatTime(end)}</>}
              </dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>{duration > 0 ? `${duration} minutes` : "Not available"}</dd>
            </div>
          </dl>
          <dl className="confirmation-provider">
            <div><dt>Doctor</dt><dd>{appointment.doctorName || "Not available"}</dd></div>
            <div><dt>Clinic</dt><dd>{appointment.clinicName || "Not available"}</dd></div>
            <div><dt>Speciality</dt><dd>{appointment.specialityName || "Not available"}</dd></div>
            {appointment.id != null && <div><dt>Booking reference</dt><dd>#{appointment.id}</dd></div>}
          </dl>
          {appointment.messageToDoctor && (
            <div className="confirmation-note">
              <h3>Message to your doctor</h3>
              <p>{appointment.messageToDoctor}</p>
            </div>
          )}
          {paymentDemo?.isDemo && (
            <div className="confirmation-note payment-confirmation-note">
              <span className="payment-demo-badge">Payment demo</span>
              <h3>{paymentMethods.find((method) => method.id === paymentDemo.method)?.name || "Demo payment method"}</h3>
              <p>No payment was processed and no invoice was sent. The payment selection is for demonstration only.</p>
            </div>
          )}
        </section>
      )}
    </SuccessMessage>
  );
}

export default AppointmentSuccess;
