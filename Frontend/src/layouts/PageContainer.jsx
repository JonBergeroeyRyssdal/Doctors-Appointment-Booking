function PageContainer({ children, size = "medium" }) {
  const columnClass =
    size === "small"
      ? "col-12 col-md-7 col-lg-5"
      : size === "large"
        ? "col-12 col-md-11 col-lg-10"
        : size === "wide"
          ? "col-12"
          : "col-12 col-md-11 col-lg-8";

  return (
    <div className="row justify-content-center px-2 px-md-2 px-lg-3">
      <div className={columnClass}>{children}</div>
    </div>
  );
}

export default PageContainer;
