export default function StatCard({ label, value, color = 'text-text-primary', unit }) {
    return (
      <div className="bg-bg-card border border-border rounded-xl p-4 flex flex-col gap-1">
        <span className="text-sm text-text-muted">{label}</span>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-semibold ${color}`}>{value ?? '—'}</span>
          {unit && <span className="text-sm text-text-muted">{unit}</span>}
        </div>
      </div>
    )
  }
   