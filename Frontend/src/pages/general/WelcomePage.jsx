import WelcomeComponent from "../../components/home/WelcomeComponent";
import PageLayout from "../../layouts/PageLayout";
import { Link } from "react-router-dom";
import AppIcon from "../../components/ui/AppIcon";

function WelcomePage() {
  return (
    <div className="welcome-page">
    <PageLayout
      eyebrow={<span className="welcome-heading-eyebrow"><AppIcon name="calendar" />Clinic appointment booking</span>}
      title={<>Your next appointment,<br /><span className="app-accent">made simple.</span></>}
      subtitle="Find a doctor, choose an available time and book at one of our clinics. Get started below, with or without an account."
      actions={<Link to="/search" className="btn btn-outline-secondary welcome-find-doctor"><AppIcon name="search" />Find a doctor</Link>}
      size="large"
    >
      <WelcomeComponent />
    </PageLayout>
    </div>
  );
}

export default WelcomePage;
