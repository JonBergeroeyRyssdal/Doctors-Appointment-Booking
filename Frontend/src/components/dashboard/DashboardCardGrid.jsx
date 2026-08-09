import { Row, Col } from "react-bootstrap";

import DashboardCard from "./DashboardCard";

function DashboardCardGrid({ title, description, cards }) {
  return (
    <Row className="g-4">
      {cards.map((card) => (
        <Col xs={12} sm={6} lg={4} xl={3} key={card.title}>
          <DashboardCard card={card} />
        </Col>
      ))}
    </Row>
  );
}

export default DashboardCardGrid;
