function LoadingSpinner() {
  return (
    <div className="content-state" role="status">
      <div className="spinner-border text-primary" aria-hidden="true">
      </div>
      <p>Loading, please wait…</p>
    </div>
  );
}

export default LoadingSpinner;
