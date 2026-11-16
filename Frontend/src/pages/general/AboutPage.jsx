import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import PageLayout from "../../layouts/PageLayout";
import AppIcon from "../../components/ui/AppIcon";

const features = [
  { icon: "search", title: "Find your doctor", text: "Browse our clinics and search for a doctor by name." },
  { icon: "calendar", title: "Choose your time", text: "Pick an available appointment that fits your schedule." },
  { icon: "shield", title: "Keep things organised", text: "Sign in to view your information and manage your appointments." },
];

function AboutPage() {
  return (
    <PageLayout
      title="Care starts with a simple booking"
      subtitle="One place to find a doctor, book an appointment and keep track of your visits."
      eyebrow="About Clinic"
      size="large"
      actions={<Button as={Link} to="/book">Book appointment</Button>}
    >
      <div className="about-features">
        {features.map((feature) => (
          <section className="about-feature" key={feature.title}>
            <span className="dashboard-icon"><AppIcon name={feature.icon} /></span>
            <h2>{feature.title}</h2>
            <p>{feature.text}</p>
          </section>
        ))}
      </div>
      <section className="about-account-panel">
        <div>
          <h2>Book as a guest. Manage more with an account.</h2>
          <p>You can book without registering. Create a patient account to see your appointments and update or cancel eligible bookings.</p>
        </div>
        <Link to="/register" className="btn btn-outline-primary">Create an account</Link>
      </section>
    </PageLayout>
  );
}

export default AboutPage;
