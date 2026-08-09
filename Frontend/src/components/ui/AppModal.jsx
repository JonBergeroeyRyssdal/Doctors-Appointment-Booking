import { Button, Modal } from "react-bootstrap";

function AppModal({
  show,
  onClose,
  title,
  children,
  closeText = "Close",
  footer,
}) {
  return (
    <Modal show={show} onHide={onClose} centered>
      {title && (
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}

      <Modal.Body>{children}</Modal.Body>

      <Modal.Footer>
        {footer || (
          <Button variant="secondary" onClick={onClose}>
            {closeText}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default AppModal;
