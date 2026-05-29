export default function Input({
  label,
  labelAction,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      {(label || labelAction) && (
        <div className="flex items-center justify-between">
          {label && <label className="text-sm text-text-secondary">{label}</label>}
          {labelAction && <div>{labelAction}</div>}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`bg-bg-input border rounded-lg px-3 py-2 text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
          error ? 'border-red' : 'border-border'
        }`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red">{error}</span>
      )}
    </div>
  )
}