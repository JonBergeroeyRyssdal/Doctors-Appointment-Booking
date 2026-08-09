import { Button } from "react-bootstrap";
import AppModal from "./AppModal";

function ConfirmModal({
  show,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "Please confirm this action.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
}) {
  return (
    <AppModal
      show={show}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>

          <Button type="button" variant={confirmVariant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="mb-0">{message}</p>
    </AppModal>
  );
}

export default ConfirmModal;
