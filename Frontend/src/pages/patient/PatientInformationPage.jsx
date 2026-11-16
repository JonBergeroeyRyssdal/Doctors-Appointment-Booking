import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import PageLayout from "../../layouts/PageLayout";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { getLoggedInPatient } from "../../services/patientsApi";
import { getPatientValue, formatPatientDate } from "../../utils/patientUtils";

function PatientInformationPage() {
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatientInformation() {
      try {
        const data = await getLoggedInPatient();
        setPatient(data);
      } catch (error) {
        console.error(error);
        setError("Could not load patient information.");
      } finally {
        setLoading(false);
      }
    }

    fetchPatientInformation();
  }, []);

  const patientDetails = patient
    ? [
        {
          id: 1,
          field: "First name",
          value: getPatientValue(patient, "firstName", "FirstName"),
        },
        {
          id: 2,
          field: "Last name",
          value: getPatientValue(patient, "lastName", "LastName"),
        },
        {
          id: 3,
          field: "Email",
          value: getPatientValue(patient, "email", "Email"),
        },
        {
          id: 4,
          field: "Date of birth",
          value: formatPatientDate(patient.birthdate || patient.Birthdate),
        },
        {
          id: 5,
          field: "Gender",
          value: getPatientValue(patient, "gender", "Gender"),
        },
        {
          id: 6,
          field: "Social security number",
          value: getPatientValue(
            patient,
            "socialSecurityNumber",
            "SocialSecurityNumber",
          ),
        },
        {
          id: 7,
          field: "Tax number",
          value: getPatientValue(patient, "taxNumber", "TaxNumber"),
        },
        {
          id: 8,
          field: "Religion",
          value: getPatientValue(patient, "religion", "Religion"),
        },
        {
          id: 9,
          field: "Driver's license number",
          value: getPatientValue(
            patient,
            "driversLicenseNumber",
            "DriversLicenseNumber",
          ),
        },
        {
          id: 10,
          field: "Medical insurance member number",
          value: getPatientValue(
            patient,
            "medicalInsuranceMemberNumber",
            "MedicalInsuranceMemberNumber",
          ),
        },
      ]
    : [];

  return (
    <PageLayout
      title="My information"
      subtitle="Your personal, contact and insurance information."
      size="medium"
    >
      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? <LoadingSpinner /> : patient ? (
        <dl className="profile-details">
          {patientDetails.map((detail) => (
            <div key={detail.id}><dt>{detail.field}</dt><dd>{detail.value}</dd></div>
          ))}
        </dl>
      ) : !error && <div className="content-state"><p>No patient information found.</p></div>}
    </PageLayout>
  );
}

export default PatientInformationPage;
