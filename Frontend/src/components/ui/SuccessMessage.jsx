import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

function SuccessMessage({
  title = "Success",
  message = "",
  primaryButtonText = "Continue",
  primaryButtonTo = "/",
  secondaryButtonText,
  secondaryButtonTo,
  variant = "success",
  confirmed = true,
  children,
}) {
  return (
    <section className="success-page" aria-labelledby="confirmation-title">
      <Card className="success-card">
        <Card.Body className="success-card-body">
          <header className="success-header">
            <div className={`success-symbol ${confirmed ? "" : "success-symbol-neutral"}`} aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none">
                {confirmed
                  ? <path d="m9 16 5 5 10-11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  : <><path d="M16 14v8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /><circle cx="16" cy="9" r="1.5" fill="currentColor" /></>}
              </svg>
            </div>
            <p className="success-eyebrow">{confirmed ? "All set" : "Appointment information"}</p>
            <h1 id="confirmation-title">{title}</h1>
            {message && <p className="success-description">{message}</p>}
          </header>

          {children}

          <div className="success-actions">
            <Button as={Link} to={primaryButtonTo} variant={variant}>
              {primaryButtonText}
              <span aria-hidden="true" className="ms-2">&rarr;</span>
            </Button>
            {secondaryButtonText && secondaryButtonTo && (
              <Button as={Link} to={secondaryButtonTo} variant="outline-secondary">
                {secondaryButtonText}
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </section>
  );
}

export default SuccessMessage;
