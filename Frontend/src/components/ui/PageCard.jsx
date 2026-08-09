import { Card } from "react-bootstrap";

function PageCard({ title, subtitle, children }) {
  return (
    <Card className="shadow-sm border-0">
      <Card.Body className="p-4">
        {title && <h1 className="mb-3">{title}</h1>}

        {subtitle && <p className="text-muted mb-4">{subtitle}</p>}

        {children}
      </Card.Body>
    </Card>
  );
}

export default PageCard;
