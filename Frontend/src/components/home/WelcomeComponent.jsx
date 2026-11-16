import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { welcomeCards } from "../../data/welcomeCards";
import AppIcon from "../ui/AppIcon";

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
        {accountOptions.map((option) => {
          const isLogin = option.to === "/login";
          const id = isLogin ? "welcome-login" : "welcome-register";
          return (
            <Card as={Link} to={option.to} key={option.to}
              className={`welcome-account flex-grow-1 ${isLogin ? "welcome-account-login" : "welcome-account-register"}`}
              aria-labelledby={`${id}-title ${id}-action`} aria-describedby={`${id}-description`}>
              <Card.Body className="welcome-account-body">
                <div className="welcome-account-heading">
                  <span className="welcome-account-icon"><AppIcon name={isLogin ? "login" : "userPlus"} /></span>
                  <div>
                    <span className="welcome-account-eyebrow">{isLogin ? "Patient access" : "Join Clinic"}</span>
                    <h2 id={`${id}-title`}>{option.title}</h2>
                  </div>
                </div>
                <p id={`${id}-description`}>{option.text}</p>
                <div className="welcome-account-footer">
                  <span className="welcome-account-detail">{isLogin ? "Your appointments & profile" : "Keep everything in one place"}</span>
                  <span id={`${id}-action`} className="welcome-account-action">{option.buttonText}<span className="welcome-account-arrow" aria-hidden="true">&rarr;</span></span>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </Col>
    </Row>
  );
}

export default WelcomeComponent;
