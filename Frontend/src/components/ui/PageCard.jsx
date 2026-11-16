import { Card } from "react-bootstrap";

function PageCard({ title, subtitle, children }) {
  return (
    <Card className="page-card">
      <Card.Body className="page-card-body">
        {title && <h1 className="page-title">{title}</h1>}

        {subtitle && <p className="text-muted page-subtitle">{subtitle}</p>}

        {children}
      </Card.Body>
    </Card>
  );
}

export default PageCard;
