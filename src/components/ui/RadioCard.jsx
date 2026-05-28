export default function RadioCard({ label, description, icon: Icon, selected, onClick }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-2 rounded-xl p-4 border transition-colors cursor-pointer w-full ${
          selected
            ? 'border-green bg-bg-card'
            : 'border-border bg-bg-card hover:border-border-light'
        }`}
      >
        {Icon && (
          <Icon size={20} className={selected ? 'text-green' : 'text-text-muted'} />
        )}
        <span className={`text-sm font-medium ${selected ? 'text-text-primary' : 'text-text-secondary'}`}>
          {label}
        </span>
        {description && (
          <span className="text-xs text-text-muted text-center">{description}</span>
        )}
      </button>
    )
  }