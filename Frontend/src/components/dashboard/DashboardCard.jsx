import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import AppIcon from "../ui/AppIcon";

function DashboardCard({ card }) {
  const content = (
    <Card className={`h-100 dashboard-card ${card.to || card.onClick ? "dashboard-card-interactive" : "dashboard-card-static"}`}>
      <Card.Body className="d-flex flex-column">
        <div className="dashboard-card-top">
          <span className="dashboard-icon"><AppIcon name={card.icon || "clinic"} /></span>
          {card.to === "/not-implemented" && <span className="feature-badge">Coming soon</span>}
        </div>
        <Card.Title as="h2">{card.title}</Card.Title>

        <div className="text-muted dashboard-card-description flex-grow-1">
          {card.text}
        </div>
        {(card.to || card.onClick) && <span className="dashboard-card-action">{card.buttonText || "Explore"}<span aria-hidden="true">&rarr;</span></span>}
      </Card.Body>
    </Card>
  );

  if (card.to) {
    return (
      <Link
        to={card.to}
        className="dashboard-card-link text-decoration-none text-dark d-block h-100"
      >
        {content}
      </Link>
    );
  }

  return card.onClick ? (
    <button type="button" onClick={card.onClick} className="dashboard-card-button h-100">{content}</button>
  ) : content;
}

export default DashboardCard;
