import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageLayout from "../layouts/PageLayout";

function NotFoundPage() {
  return (
    <PageLayout
      title="404 - Page not found"
      eyebrow="Let’s get you back"
      subtitle="The page you are looking for does not exist."
    >
      <p className="mb-4">
        The address may be wrong, or the page may have been moved.
      </p>

      <Button as={Link} to="/" variant="primary">
        Go to front page
      </Button>
    </PageLayout>
  );
}

export default NotFoundPage;
