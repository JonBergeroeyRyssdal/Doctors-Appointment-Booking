import { useId } from "react";

function UniversalForm({
  fields,
  formData,
  error = "",
  success = "",
  onChange,
  onSubmit,
  buttonText = "Submit",
  buttonVariant = "primary",
  loading = false,
  loadingText = "Loading...",
  widthClass = "",
  sections,
  children,
  secondaryAction,
}) {
  const formId = useId();
  const hasRequiredFields = fields.some((field) => field.required);
  const renderField = (field) => {
    const id = `${formId}-${field.name}`;
    const helpId = `${id}-help`;
    const commonProps = {
      id,
      name: field.name,
      value: formData[field.name] ?? "",
      onChange,
      required: field.required,
      disabled: loading || field.disabled,
      "aria-describedby": field.helpText ? helpId : undefined,
      autoComplete: field.autoComplete,
    };

          return (
            <div className={`app-form-field ${field.type === "textarea" ? "app-form-field-wide" : ""}`} key={field.name}>
              {field.label && (
                <label className="form-label" htmlFor={id}>
                  {field.label}
                  {field.required && <span className="app-required" aria-hidden="true"> *</span>}
                </label>
              )}

              {field.type === "select" ? (
                <select
                  {...commonProps}
                  className={`form-select ${commonProps.value === "" ? "app-select-empty" : ""}`}
                >
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  {...commonProps}
                  className="form-control"
                  rows={field.rows || 3}
                  placeholder={field.placeholder}
                  minLength={field.minLength}
                  maxLength={field.maxLength}
                />
              ) : (
                <input
                  {...commonProps}
                  type={field.type || "text"}
                  className="form-control"
                  placeholder={field.placeholder}
                  inputMode={field.inputMode}
                  min={field.min}
                  max={field.max}
                  minLength={field.minLength}
                  maxLength={field.maxLength}
                  pattern={field.pattern}
                />
              )}

              {field.helpText && <div id={helpId} className="form-text">{field.helpText}</div>}
            </div>
          );

  };

  return (
    <form
      className={`app-form ${fields.length <= 2 ? "app-form-compact" : ""} ${widthClass}`}
      onSubmit={onSubmit}
      aria-busy={loading}
      onInvalidCapture={(event) => {
        const details = event.target.closest("details");
        if (details) details.open = true;
      }}
    >
      {error && <div className="alert alert-danger app-form-feedback" role="alert">{error}</div>}
      {success && <div className="alert alert-success app-form-feedback" role="status">{success}</div>}
      {hasRequiredFields && (
        <p className="app-form-note"><span aria-hidden="true">*</span> Required fields</p>
      )}

      {children}
      {sections ? sections.map((section) => {
        const content = <div className="app-form-grid">{section.fields.map(renderField)}</div>;
        return section.collapsible ? (
          <details className="app-form-section app-form-optional" key={section.title}>
            <summary>{section.title}</summary>
            {section.description && <p className="form-section-description">{section.description}</p>}
            {content}
          </details>
        ) : (
          <fieldset className="app-form-section" key={section.title}>
            <legend>{section.title}</legend>
            {section.description && <p className="form-section-description">{section.description}</p>}
            {content}
          </fieldset>
        );
      }) : <div className="app-form-grid">{fields.map(renderField)}</div>}

      <div className="app-form-actions">
        {secondaryAction}
        <button type="submit" className={`btn btn-${buttonVariant} app-form-submit`} disabled={loading}>
          {loading && <span className="spinner-border spinner-border-sm" aria-hidden="true" />}
          <span aria-live="polite">{loading ? loadingText : buttonText}</span>
        </button>
      </div>
    </form>
  );
}

export default UniversalForm;
