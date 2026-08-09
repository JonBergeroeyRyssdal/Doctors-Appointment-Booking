import { useEffect, useState } from "react";
import PageLayout from "../../layouts/PageLayout";
import ListTable from "../../components/ui/ListTable";

import { searchDoctors } from "../../services/doctorsApi";

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const doctorColumns = [
    {
      key: "doctor",
      label: "Doctor",
      render: (doctor) => `${doctor.firstName} ${doctor.lastName}`,
    },
    {
      key: "clinicName",
      label: "Clinic",
      render: (doctor) => doctor.clinicName || "Unknown clinic",
    },
    {
      key: "specialityName",
      label: "Speciality",
      render: (doctor) => doctor.specialityName || "Unknown speciality",
    },
  ];

  useEffect(() => {
    const trimmedSearchTerm = searchTerm.trim();

    if (!trimmedSearchTerm) {
      setDoctors([]);
      setMessage("");
      return;
    }

    const timeoutId = setTimeout(() => {
      handleSearch(trimmedSearchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  async function handleSearch(name) {
    try {
      setLoading(true);
      setMessage("");

      const data = await searchDoctors(name);

      if (data.length === 0) {
        setDoctors([]);
        setMessage("No doctors matched your search.");
        return;
      }

      setDoctors(data);
      setMessage("");
    } catch (error) {
      console.error(error);
      setDoctors([]);
      setMessage("Could not search for doctors.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout
      title="Search Doctors"
      subtitle="Search for doctors by first name or last name."
      size="medium"
    >
      <div className="mb-4">
        <label className="form-label">Doctor name</label>

        <input
          type="text"
          className="form-control"
          placeholder="Enter first or last name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <div className="alert alert-secondary">Searching...</div>}

      {message && <div className="alert alert-info">{message}</div>}

      {doctors.length > 0 && (
        <div className="border rounded p-3 bg-white">
          <h2 className="h5 mb-3">Search results</h2>

          <ListTable
            columns={doctorColumns}
            items={doctors}
            loading={loading}
            emptyMessage="No doctors found."
          />
        </div>
      )}
    </PageLayout>
  );
}

export default SearchPage;
