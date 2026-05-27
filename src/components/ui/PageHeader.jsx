export default function PageHeader({ title, action }) {
    return (
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
        {action && <div>{action}</div>}
      </div>
    )
  }