import AppModal from "../ui/AppModal";

function AppointmentNotesModal({ appointment, show, onClose }) {
  return (
    <AppModal show={show} onClose={onClose} title="Message to doctor">
      {appointment?.messageToDoctor ? (
        <p className="mb-0">{appointment.messageToDoctor}</p>
      ) : (
        <p className="text-muted mb-0">No message added.</p>
      )}
    </AppModal>
  );
}

export default AppointmentNotesModal;
