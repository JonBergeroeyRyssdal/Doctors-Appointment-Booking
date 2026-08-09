import { Button } from "react-bootstrap";

export function doctorColumns(handleEdit, handleDelete) {
  return [
    {
      key: "name",
      label: "Name",
      render: (doctor) => `${doctor.firstName} ${doctor.lastName}`,
    },
    {
      key: "clinic",
      label: "Clinic",
      render: (doctor) => doctor.clinicName || "Unknown",
    },
    {
      key: "speciality",
      label: "Speciality",
      render: (doctor) => doctor.specialityName || "Unknown",
    },
    {
      key: "edit",
      label: "Edit",
      render: (doctor) => (
        <>
          <Button
            variant="warning"
            size="sm"
            className="me-2"
            onClick={() => handleEdit(doctor)}
          >
            Edit
          </Button>
        </>
      ),
    },
    {
      key: "delete",
      label: "Delete",
      render: (doctor) => (
        <>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(doctor.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];
}
