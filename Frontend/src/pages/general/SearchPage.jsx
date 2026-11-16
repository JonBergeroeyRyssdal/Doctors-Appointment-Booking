import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../../layouts/PageLayout";
import AppIcon from "../../components/ui/AppIcon";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { searchDoctors } from "../../services/doctorsApi";

const initialResult = { query: "", doctors: [], error: "" };

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState(initialResult);
  const inputRef = useRef(null);
  const query = searchTerm.trim();
  const loading = Boolean(query) && result.query !== query;

  useEffect(() => {
    if (!query) return;
    let active = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        const doctors = await searchDoctors(query, { signal: controller.signal });
        if (active) setResult({ query, doctors, error: "" });
      } catch (error) {
        if (active && error.name !== "AbortError") {
          setResult({ query, doctors: [], error: "Could not search for doctors. Please try again." });
        }
      }
    }, 300);
    return () => {
      active = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  function handleChange(event) {
    const next = event.target.value;
    if (next.trim() !== query) setResult(initialResult);
    setSearchTerm(next);
  }

  function clearSearch() {
    setSearchTerm("");
    setResult(initialResult);
    inputRef.current?.focus();
  }

  return (
    <PageLayout
      title="Find your doctor"
      subtitle="Search by first or last name to find a doctor and see where they practise."
      eyebrow="Explore our care team"
      size="large"
      actions={<Link to="/clinics" className="btn btn-outline-secondary">Browse clinics</Link>}
    >
      <section className="doctor-search-panel" aria-label="Search for a doctor">
        <div className="doctor-search-intro">
          <span className="dashboard-icon"><AppIcon name="search" /></span>
          <div><h2>Who are you looking for?</h2><p>Enter a name below. Results update as you type.</p></div>
        </div>
        <form className="app-form doctor-search-form" role="search" onSubmit={(event) => event.preventDefault()}>
          <label className="form-label" htmlFor="doctor-search">Doctor name</label>
          <div className="doctor-search-control">
            <AppIcon name="search" />
            <input ref={inputRef} type="search" id="doctor-search" className="form-control" placeholder="Enter first or last name" value={searchTerm} onChange={handleChange} aria-describedby="doctor-search-help" aria-controls="doctor-search-results" autoComplete="off" />
            {searchTerm && <button type="button" className="search-clear" onClick={clearSearch} aria-label="Clear search">×</button>}
          </div>
          <p id="doctor-search-help" className="form-text">You can search with all or part of a name.</p>
        </form>
      </section>

      <section id="doctor-search-results" className="doctor-search-results" aria-labelledby="doctor-results-heading" aria-busy={loading}>
        <div className="doctor-results-heading">
          <h2 id="doctor-results-heading">{query ? "Search results" : "Discover your care team"}</h2>
          <span className="search-result-count" role="status">
            {loading ? "Searching…" : query && !result.error ? `${result.doctors.length} ${result.doctors.length === 1 ? "doctor" : "doctors"} found` : ""}
          </span>
        </div>
        {!query ? (
          <div className="content-state content-state-empty">
            <span className="dashboard-icon"><AppIcon name="doctor" /></span>
            <h3>Start with a name</h3>
            <p>Search for a doctor, or explore our clinics to find a location near you.</p>
            <Link to="/clinics" className="search-inline-link">Explore our clinics &rarr;</Link>
          </div>
        ) : loading ? <LoadingSpinner />
          : result.error ? <div className="alert alert-danger" role="alert">{result.error}</div>
            : result.doctors.length === 0 ? (
              <div className="content-state content-state-empty">
                <span className="dashboard-icon"><AppIcon name="search" /></span>
                <h3>No matching doctors</h3>
                <p>Try a different spelling or a shorter part of the name.</p>
                <button type="button" className="btn btn-outline-secondary" onClick={clearSearch}>Clear search</button>
              </div>
            ) : (
              <ul className="doctor-results-grid">
                {result.doctors.map((doctor) => (
                  <li key={doctor.id} className="doctor-result-card">
                    <div className="doctor-result-header">
                      <span className="dashboard-icon"><AppIcon name="doctor" /></span>
                      <div><h3>Dr. {doctor.firstName} {doctor.lastName}</h3><span className="doctor-speciality">{doctor.specialityName || "Speciality not listed"}</span></div>
                    </div>
                    <div className="doctor-result-location"><AppIcon name="clinic" /><span>{doctor.clinicName || "Clinic not listed"}</span></div>
                  </li>
                ))}
              </ul>
            )}
      </section>
    </PageLayout>
  );
}

export default SearchPage;
