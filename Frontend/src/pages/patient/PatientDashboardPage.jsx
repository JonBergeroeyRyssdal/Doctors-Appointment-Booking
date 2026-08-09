import { useEffect, useState } from "react";
import DashboardCardGrid from "../../components/dashboard/DashboardCardGrid";
import PageLayout from "../../layouts/PageLayout";
import { getLoggedInPatient } from "../../services/patientsApi";

import { patientDashboardCards } from "../../data/patientDashboardCards";

function PatientDashboardPage() {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    fetchPatient();
  }, []);

  async function fetchPatient() {
    try {
      const data = await getLoggedInPatient();
      setPatient(data);
    } catch (error) {
      console.error(error);
    }
  }

  const firstName = patient?.firstName || patient?.FirstName || "";

  return (
    <PageLayout
      title={`Welcome ${firstName}`}
      subtitle="Manage your appointments and personal information"
      size="large"
    >
      <DashboardCardGrid cards={patientDashboardCards} />
    </PageLayout>
  );
}

export default PatientDashboardPage;
