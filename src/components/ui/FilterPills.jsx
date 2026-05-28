export default function FilterPills({ options, active, onChange }) {
    return (
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer
              ${active === option.value
                ? 'bg-white text-black'
                : 'bg-transparent border border-border text-text-muted'
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    )
  }