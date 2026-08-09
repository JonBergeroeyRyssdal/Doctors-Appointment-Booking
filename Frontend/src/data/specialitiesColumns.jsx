import { Button } from "react-bootstrap";

export function getSpecialityColumns(handleEdit, handleDelete) {
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
      key: "edit",
      label: "Edit",
      render: (speciality) => (
        <Button
          size="sm"
          variant="warning"
          onClick={() => handleEdit(speciality)}
        >
          Edit
        </Button>
      ),
    },
    {
      key: "delete",
      label: "Delete",
      render: (speciality) => (
        <Button
          size="sm"
          variant="danger"
          onClick={() => handleDelete(speciality.id)}
        >
          Delete
        </Button>
      ),
    },
  ];
}
