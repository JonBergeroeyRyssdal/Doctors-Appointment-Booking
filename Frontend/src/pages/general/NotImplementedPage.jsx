import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

import PageLayout from "../../layouts/PageLayout";

function NotImplementedPage() {
  return (
    <PageLayout
      title="Page not implemented"
      subtitle="This feature is currently under development."
      size="large"
    ></PageLayout>
  );
}

export default NotImplementedPage;
