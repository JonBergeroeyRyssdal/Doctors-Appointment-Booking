import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

import PageLayout from "../../layouts/PageLayout";

function NotImplementedPage() {
  return (
    <PageLayout
      title="Page not implemented"
      subtitle="This feature is currently under development."
      size="large"
      eyebrow="Coming soon"
    >
      <div className="feature-placeholder">
        <p>This part of Clinic is not ready yet. You can still browse doctors, find a clinic or manage your existing appointments.</p>
        <Button as={Link} to="/" variant="primary">Back to home</Button>
      </div>
    </PageLayout>
  );
}

export default NotImplementedPage;
