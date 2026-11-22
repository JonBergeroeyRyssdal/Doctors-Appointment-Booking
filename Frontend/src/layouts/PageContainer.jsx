function PageContainer({ children, size = "medium" }) {
  return <div className={`page-container page-container-${size}`}>{children}</div>;
}
export default PageContainer;
