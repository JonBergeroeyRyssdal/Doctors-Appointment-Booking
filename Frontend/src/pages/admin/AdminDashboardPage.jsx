import DashboardCardGrid from "../../components/dashboard/DashboardCardGrid";
import PageLayout from "../../layouts/PageLayout";
import { adminDashboardCards } from "../../data/adminDashboardCards";

function AdminDashboardPage() {
  return (
    <PageLayout
      title="Admin Dashboard"
      subtitle="Manage clinics, doctors, admins, patients and specialities."
      size="large"
      loading={loading}
    >
      <DashboardCardGrid cards={adminDashboardCards} />
    </PageLayout>
  );
}

export default AdminDashboardPage;
