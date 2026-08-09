import { Link } from "react-router-dom";
import { Card, Button, Alert } from "react-bootstrap";

function SuccessMessage({
  title = "Success",
  message = "",
  primaryButtonText = "Continue",
  primaryButtonTo = "/",
  secondaryButtonText,
  secondaryButtonTo,
  variant = "success",
  children,
}) {
  return (
    <div className="d-flex justify-content-center">
      <Card className="shadow-sm text-center" style={{ maxWidth: "500px" }}>
        <Card.Body>
          <Alert variant={variant}>{title}</Alert>

          <p className="text-muted mb-4">{message}</p>

          {children}

          <div className="d-grid gap-2">
            <Button as={Link} to={primaryButtonTo} variant={variant}>
              {primaryButtonText}
            </Button>

            {secondaryButtonText && secondaryButtonTo && (
              <Button
                as={Link}
                to={secondaryButtonTo}
                variant={`outline-${variant}`}
              >
                {secondaryButtonText}
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default SuccessMessage;
