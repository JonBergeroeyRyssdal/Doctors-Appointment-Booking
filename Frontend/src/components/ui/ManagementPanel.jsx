import { useEffect, useRef } from "react";
import AppIcon from "./AppIcon";

function ManagementPanel({ title, description, icon, count, loading, editingId, kind = "form", children }) {
  const headingRef = useRef(null);
  useEffect(() => {
    if (editingId) {
      headingRef.current?.focus({ preventScroll: true });
      headingRef.current?.scrollIntoView?.({ block: "nearest" });
    }
  }, [editingId]);

  return (
    <section className={`management-panel management-panel-${kind}`}>
      <header className="management-panel-header">
        <span className="dashboard-icon"><AppIcon name={icon} /></span>
        <div>
          <h2 ref={headingRef} tabIndex={-1}>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {editingId ? <span className="management-count">Editing</span>
          : count != null && !loading && <span className="management-count" aria-label={`${count} records`}>{count}</span>}
      </header>
      <div className="management-panel-body">{children}</div>
    </section>
  );
}

export default ManagementPanel;
