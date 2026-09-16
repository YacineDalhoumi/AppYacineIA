const COLOR_VARS = {
  accent: { bg: 'var(--color-accent-soft)', fg: 'var(--color-accent)' },
  success: { bg: 'var(--color-success-soft)', fg: 'var(--color-success)' },
  warning: { bg: 'var(--color-warning-soft)', fg: 'var(--color-warning)' },
  rdv: { bg: 'var(--color-rdv-soft)', fg: 'var(--color-rdv)' },
  danger: { bg: 'var(--color-danger-soft)', fg: 'var(--color-danger)' },
  neutral: { bg: 'var(--color-neutral-soft)', fg: 'var(--color-neutral)' },
}

export default function StatCard({ label, value, sub, icon, color = 'accent' }) {
  const c = COLOR_VARS[color] || COLOR_VARS.accent
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-card-label">{label}</span>
        {icon && (
          <span className="stat-card-icon" style={{ background: c.bg, color: c.fg }}>
            {icon}
          </span>
        )}
      </div>
      <span className="stat-card-value">{value}</span>
      {sub && <span className="stat-card-sub">{sub}</span>}
    </div>
  )
}
