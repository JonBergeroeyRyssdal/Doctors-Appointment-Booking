import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";

function DashboardCard({ card }) {
  const content = (
    <Card className="h-100 shadow-sm border-0 dashboard-card">
      <Card.Body className="d-flex flex-column">
        <Card.Title>{card.title}</Card.Title>

        <Card.Text className="text-muted mb-0 flex-grow-1">
          {card.text}
        </Card.Text>
      </Card.Body>
    </Card>
  );

  if (card.to) {
    return (
      <Link
        to={card.to}
        className="text-decoration-none text-dark d-block h-100"
      >
        {content}
      </Link>
    );
  }

  return (
    <div onClick={card.onClick} className="h-100" style={{ cursor: "pointer" }}>
      {content}
    </div>
  );
}

export default DashboardCard;
