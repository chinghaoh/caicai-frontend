export default function EmptyState({ icon, title, description, action }) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        {icon && <span className="text-4xl mb-4">{icon}</span>}
        <p className="text-base font-semibold text-text-primary mb-1">{title}</p>
        {description && <p className="text-sm text-text-muted mb-6 max-w-xs">{description}</p>}
        {action && <div>{action}</div>}
      </div>
    )
  }