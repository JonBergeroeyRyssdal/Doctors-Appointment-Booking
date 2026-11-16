import PageContainer from "./PageContainer";
import PageCard from "../components/ui/PageCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";

function PageLayout({
  title,
  subtitle,
  eyebrow,
  actions,
  size = "large",
  loading = false,
  children,
}) {
  return (
    <PageContainer size={size}>
      <PageCard title={title} subtitle={subtitle} eyebrow={eyebrow} actions={actions}>
        {loading ? <LoadingSpinner /> : children}
      </PageCard>
    </PageContainer>
  );
}

export default PageLayout;
