import { Button } from "react-bootstrap";

export function getAdminColumns(onEdit, onDelete) {
  return [
    {
      key: "id",
      label: "ID",
    },
    {
      key: "username",
      label: "Username",
    },
    {
      key: "edit",
      label: "Edit",
      render: (admin) => (
        <Button variant="warning" size="sm" onClick={() => onEdit(admin)}>
          Edit
        </Button>
      ),
    },
    {
      key: "delete",
      label: "Delete",
      render: (admin) => (
        <Button variant="danger" size="sm" onClick={() => onDelete(admin.id)}>
          Delete
        </Button>
      ),
    },
  ];
}
