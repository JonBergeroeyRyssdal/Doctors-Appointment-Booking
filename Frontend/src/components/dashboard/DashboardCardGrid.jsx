import { Row, Col } from "react-bootstrap";

import DashboardCard from "./DashboardCard";

function DashboardCardGrid({ cards }) {
  return (
    <Row className="g-4">
      {cards.map((card) => (
        <Col xs={12} md={6} xl={4} key={card.id || card.to || card.title}>
          <DashboardCard card={card} />
        </Col>
      ))}
    </Row>
  );
}

export default DashboardCardGrid;
