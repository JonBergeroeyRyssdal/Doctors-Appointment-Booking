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
}) {
  return (
    <>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className={widthClass} onSubmit={onSubmit}>
        {fields.map((field) => (
          <div className="mb-3" key={field.name}>
            {field.label && <label className="form-label">{field.label}</label>}

            {field.type === "select" ? (
              <select
                name={field.name}
                className="form-select"
                value={formData[field.name] || ""}
                onChange={onChange}
                required={field.required}
                disabled={field.disabled}
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                name={field.name}
                className="form-control"
                rows={field.rows || 3}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={onChange}
                required={field.required}
                maxLength={field.maxLength}
              />
            ) : (
              <input
                type={field.type || "text"}
                name={field.name}
                className="form-control"
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={onChange}
                required={field.required}
                disabled={field.disabled}
                min={field.min}
                max={field.max}
                minLength={field.minLength}
                maxLength={field.maxLength}
                pattern={field.pattern}
              />
            )}

            {field.helpText && (
              <div className="form-text text-muted">{field.helpText}</div>
            )}
          </div>
        ))}

        <button
          type="submit"
          className={`btn btn-${buttonVariant}`}
          disabled={loading}
        >
          {loading ? loadingText : buttonText}
        </button>
      </form>
    </>
  );
}

export default UniversalForm;
