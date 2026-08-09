import { Button } from "react-bootstrap";

export function getClinicColumns(handleEdit, handleDelete) {
  return [
    {
      key: "id",
      label: "ID",
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "address",
      label: "Address",
    },
    {
      key: "postalCode",
      label: "Postal Code",
    },
    {
      key: "city",
      label: "City",
    },
    {
      key: "edit",
      label: "Edit",
      render: (clinic) => (
        <Button variant="warning" size="sm" onClick={() => handleEdit(clinic)}>
          Edit
        </Button>
      ),
    },
    {
      key: "delete",
      label: "Delete",
      render: (clinic) => (
        <Button
          variant="danger"
          size="sm"
          onClick={() => handleDelete(clinic.id)}
        >
          Delete
        </Button>
      ),
    },
  ];
}
