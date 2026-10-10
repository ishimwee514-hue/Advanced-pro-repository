function MetricCard({ label, value, change, icon, tone }) {
  return (
    <article className="metric-card">
      <div className={`metric-icon ${tone}`} aria-hidden="true">{icon}</div>
      <div className="metric-label">{label}</div>
      <strong className="metric-value">{value}</strong>
      <div className={`metric-change ${tone === 'orange' ? 'subtle' : ''}`}>
        {tone !== 'orange' && <span aria-hidden="true">↗</span>} {change}
      </div>
    </article>
  )
}

export default MetricCard
