import PageContainer from "./PageContainer";
import PageCard from "../components/ui/PageCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";

function PageLayout({
  title,
  subtitle,
  description,
  size = "large",
  loading = false,
  children,
}) {
  return (
    <PageContainer size={size}>
      <PageCard title={title} subtitle={subtitle}>
        {loading ? <LoadingSpinner /> : children}
      </PageCard>
    </PageContainer>
  );
}

export default PageLayout;
