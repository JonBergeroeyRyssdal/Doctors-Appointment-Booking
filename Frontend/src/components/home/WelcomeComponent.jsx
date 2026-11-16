import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { welcomeCards } from "../../data/welcomeCards";

function WelcomeComponent() {
  const [booking, ...accountOptions] = welcomeCards;

  return (
    <Row className="g-4 align-items-stretch">
      <Col xs={12} lg={7}>
        <Card className="welcome-booking h-100">
          <Card.Body className="d-flex flex-column align-items-start justify-content-center p-4 p-md-5">
            <span className="welcome-eyebrow mb-3">Your next appointment</span>
            <h2 className="mb-3">{booking.title}</h2>
            <p className="mb-4">{booking.text}</p>
            <Button as={Link} to={booking.to} variant="primary" className="welcome-booking-button">
              Book appointment <span aria-hidden="true">&rarr;</span>
            </Button>
            <small className="text-muted mt-3">No account needed</small>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={12} lg={5} className="d-flex flex-column gap-4">
        {accountOptions.map((option) => (
          <Card key={option.to} className="welcome-account flex-grow-1">
            <Card.Body className="p-4">
              <h2 className="h5 mb-2">{option.title}</h2>
              <p className="mb-3">{option.text}</p>
              <Link to={option.to} className="welcome-account-link">
                {option.buttonText} <span aria-hidden="true">&rarr;</span>
              </Link>
            </Card.Body>
          </Card>
        ))}
      </Col>
    </Row>
  );
}

export default WelcomeComponent;
