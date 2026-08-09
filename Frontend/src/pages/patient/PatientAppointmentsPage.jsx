import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Alert } from "react-bootstrap";
import PageLayout from "../../layouts/PageLayout";
import ListTable from "../../components/ui/ListTable";
import AppointmentNotesModal from "../../components/appointment/AppointmentNotesModal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import {
  getMyAppointments,
  cancelAppointment,
} from "../../services/appointmentsApi";

function PatientAppointmentsPage() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    setLoading(true);
    setError("");

    try {
      const data = await getMyAppointments();
      setAppointments(data);
    } catch (error) {
      console.error(error);
      setError(error.message || "Could not load appointments.");
    } finally {
      setLoading(false);
    }
  }

  function canModifyAppointment(appointmentDateTime) {
    const appointmentDate = new Date(appointmentDateTime);
    const now = new Date();

    const hoursUntilAppointment = (appointmentDate - now) / (1000 * 60 * 60);

    return hoursUntilAppointment >= 24;
  }

  function getModificationMessage(appointment) {
    if (canModifyAppointment(appointment.appointmentDateTime)) {
      return "";
    }

    return "Less than 24 hours until the appointment. Please contact the clinic directly.";
  }

  function handleEdit(appointment) {
    if (!canModifyAppointment(appointment.appointmentDateTime)) {
      setError(getModificationMessage(appointment));
      return;
    }

    navigate(`/patient/appointments/${appointment.id}/edit`, {
      state: { appointment },
    });
  }

  async function confirmCancelAppointment() {
    if (!appointmentToCancel) return;

    if (!canModifyAppointment(appointmentToCancel.appointmentDateTime)) {
      setAppointmentToCancel(null);
      setError(getModificationMessage(appointmentToCancel));
      return;
    }

    try {
      await cancelAppointment(appointmentToCancel.id);

      setMessage("Appointment cancelled.");
      setError("");
      setAppointmentToCancel(null);

      fetchAppointments();
    } catch (error) {
      console.error(error);
      setError(error.message || "Could not cancel appointment.");
    }
  }

  function handleOpenNotes(appointment) {
    setSelectedAppointment(appointment);
  }

  function handleCloseNotes() {
    setSelectedAppointment(null);
  }

  const now = new Date();

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      appointment.status !== "Cancelled" &&
      new Date(appointment.appointmentDateTime) >= now,
  );

  const pastAppointments = appointments.filter(
    (appointment) =>
      appointment.status !== "Cancelled" &&
      new Date(appointment.appointmentDateTime) < now,
  );

  const cancelledAppointments = appointments.filter(
    (appointment) => appointment.status === "Cancelled",
  );

  const baseColumns = [
    {
      key: "doctor",
      label: "Doctor",
      render: (appointment) =>
        `Dr. ${appointment.doctorFirstName} ${appointment.doctorLastName}`,
    },
    {
      key: "speciality",
      label: "Speciality",
      render: (appointment) => appointment.specialityName || "Unknown",
    },
    {
      key: "date",
      label: "Date",
      render: (appointment) =>
        new Date(appointment.appointmentDateTime).toLocaleDateString(),
    },
    {
      key: "time",
      label: "Time",
      render: (appointment) =>
        new Date(appointment.appointmentDateTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      key: "durationMinutes",
      label: "Duration",
      render: (appointment) => `${appointment.durationMinutes} min`,
    },
    {
      key: "notes",
      label: "Notes",
      render: (appointment) => (
        <Button
          size="sm"
          variant="outline-secondary"
          onClick={() => handleOpenNotes(appointment)}
        >
          View
        </Button>
      ),
    },
  ];

  const upcomingColumns = [
    ...baseColumns,
    {
      key: "edit",
      label: "Edit",
      render: (appointment) => {
        const canModify = canModifyAppointment(appointment.appointmentDateTime);

        return (
          <div className="d-flex flex-column gap-1">
            <Button
              size="sm"
              variant="outline-primary"
              disabled={!canModify}
              onClick={() => handleEdit(appointment)}
            >
              Edit
            </Button>

            {!canModify && <small className="text-muted">Contact clinic</small>}
          </div>
        );
      },
    },
    {
      key: "cancel",
      label: "Cancel",
      render: (appointment) => {
        const canModify = canModifyAppointment(appointment.appointmentDateTime);

        return (
          <div className="d-flex flex-column gap-1">
            <Button
              size="sm"
              variant="danger"
              disabled={!canModify}
              onClick={() => setAppointmentToCancel(appointment)}
            >
              Cancel
            </Button>

            {!canModify && <small className="text-muted">Less than 24h</small>}
          </div>
        );
      },
    },
  ];

  const pastColumns = [
    ...baseColumns,
    {
      key: "status",
      label: "Status",
      render: () => "Completed",
    },
  ];

  const cancelledColumns = [
    ...baseColumns,
    {
      key: "status",
      label: "Status",
      render: (appointment) => appointment.status,
    },
  ];

  return (
    <PageLayout
      title="My appointments"
      subtitle="View and manage your booked appointments."
      size="wide"
    >
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <h2 className="h5 mb-3">Upcoming appointments</h2>
      <Alert variant="info" className="mb-3">
        Appointments cannot be changed or cancelled less than 24 hours before
        the scheduled appointment time. Please contact the clinic directly if
        you need assistance.
      </Alert>
      <ListTable
        columns={upcomingColumns}
        items={upcomingAppointments}
        loading={loading}
        emptyMessage="No upcoming appointments found."
      />

      <h2 className="h5 mt-5 mb-3">Past appointments</h2>

      <ListTable
        columns={pastColumns}
        items={pastAppointments}
        loading={loading}
        emptyMessage="No past appointments found."
      />

      <h2 className="h5 mt-5 mb-3">Cancelled appointments</h2>

      <ListTable
        columns={cancelledColumns}
        items={cancelledAppointments}
        loading={loading}
        emptyMessage="No cancelled appointments found."
      />

      <AppointmentNotesModal
        appointment={selectedAppointment}
        show={!!selectedAppointment}
        onClose={handleCloseNotes}
      />

      <ConfirmModal
        show={!!appointmentToCancel}
        onClose={() => setAppointmentToCancel(null)}
        onConfirm={confirmCancelAppointment}
        title="Cancel appointment"
        message="Are you sure you want to cancel this appointment?"
        confirmText="Cancel appointment"
      />
    </PageLayout>
  );
}

export default PatientAppointmentsPage;
