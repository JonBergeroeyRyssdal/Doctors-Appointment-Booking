import { useEffect, useState } from "react";
import DashboardCardGrid from "../../components/dashboard/DashboardCardGrid";
import PageLayout from "../../layouts/PageLayout";
import { getClinics } from "../../services/clinicsApi";

function ClinicsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function fetchClinics() {
    try {
      setLoading(true);

      const data = await getClinics();

      const formattedCards = data.map((clinic) => ({
        id: clinic.id,
        icon: "clinic",
        title: clinic.name,
        text: (
          <>
            <div>{clinic.address}</div>
            <div>{clinic.postalCode}</div>
            <div>{clinic.city}</div>
          </>
        ),
      }));

      if (active) setCards(formattedCards);
    } catch (error) {
      console.error(error);
      if (active) setError("Failed to load clinics.");
    } finally {
      if (active) setLoading(false);
    }
    }
    fetchClinics();
    return () => { active = false; };
  }, []);

  return (
    <PageLayout
      title="Our Clinics"
      eyebrow="Find your location"
      subtitle="Browse our clinics and find the location that suits you best."
      size="large"
      loading={loading}
    >
      {error ? <div className="alert alert-danger" role="alert">{error}</div>
        : cards.length ? <DashboardCardGrid cards={cards} />
          : <div className="content-state"><p>No clinics available yet.</p></div>}
    </PageLayout>
  );
}

export default ClinicsPage;
