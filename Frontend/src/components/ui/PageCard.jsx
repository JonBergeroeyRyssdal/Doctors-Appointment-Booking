function PageCard({ title, subtitle, eyebrow, actions, children }) {
  return (
    <section className="page-section">
        <header className="page-header">
          <div>
            {eyebrow && <p className="page-eyebrow">{eyebrow}</p>}
            {title && <h1 className="page-title">{title}</h1>}
            {subtitle && <p className="text-muted page-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="page-header-actions">{actions}</div>}
        </header>
        <div className="page-content">{children}</div>
    </section>
  );
}

export default PageCard;
