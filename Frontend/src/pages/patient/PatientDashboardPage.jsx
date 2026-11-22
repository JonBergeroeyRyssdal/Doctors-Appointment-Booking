import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import DashboardCardGrid from "../../components/dashboard/DashboardCardGrid";
import PageLayout from "../../layouts/PageLayout";
import { getLoggedInPatient } from "../../services/patientsApi";

import { patientDashboardCards } from "../../data/patientDashboardCards";

function PatientDashboardPage() {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    let active = true;
    async function fetchPatient() {
    try {
      const data = await getLoggedInPatient();
      if (active) setPatient(data);
    } catch (error) {
      console.error(error);
    }
    }
    fetchPatient();
    return () => { active = false; };
  }, []);

  const firstName = patient?.firstName || patient?.FirstName || "";

  return (
    <PageLayout
      title={firstName ? `Welcome, ${firstName}` : "Your patient dashboard"}
      eyebrow="Your care, in one place"
      actions={<Button as={Link} to="/patient/book">Book appointment</Button>}
      subtitle="Manage your appointments and personal information"
      size="wide"
    >
      <DashboardCardGrid cards={patientDashboardCards} />
    </PageLayout>
  );
}

export default PatientDashboardPage;
