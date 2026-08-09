import { useEffect, useState } from "react";
import DashboardCardGrid from "../../components/dashboard/DashboardCardGrid";
import PageLayout from "../../layouts/PageLayout";
import { getClinics } from "../../services/clinicsApi";

function ClinicsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClinics();
  }, []);

  async function fetchClinics() {
    try {
      setLoading(true);

      const data = await getClinics();

      const formattedCards = data.map((clinic) => ({
        title: clinic.name,
        text: (
          <>
            <div>{clinic.address}</div>
            <div>{clinic.postalCode}</div>
            <div>{clinic.city}</div>
          </>
        ),
        to: "/not-implemented",
        buttonText: "View clinic",
      }));

      setCards(formattedCards);
    } catch (error) {
      console.error(error);
      setError("Failed to load clinics.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p>Loading clinics...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <PageLayout
      title="Our Clinics"
      subtitle="Browse our clinics and find the location that suits you best."
      size="large"
      loading={loading}
    >
      <DashboardCardGrid description="" cards={cards} />
    </PageLayout>
  );
}

export default ClinicsPage;
