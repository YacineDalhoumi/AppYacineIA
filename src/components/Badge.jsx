const COLOR_VARS = {
  accent: { bg: 'var(--color-accent-soft)', fg: 'var(--color-accent)' },
  success: { bg: 'var(--color-success-soft)', fg: 'var(--color-success)' },
  warning: { bg: 'var(--color-warning-soft)', fg: 'var(--color-warning)' },
  rdv: { bg: 'var(--color-rdv-soft)', fg: 'var(--color-rdv)' },
  danger: { bg: 'var(--color-danger-soft)', fg: 'var(--color-danger)' },
  neutral: { bg: 'var(--color-neutral-soft)', fg: 'var(--color-neutral)' },
}

export default function Badge({ label, color = 'neutral' }) {
  const c = COLOR_VARS[color] || COLOR_VARS.neutral
  return (
    <span className="badge" style={{ background: c.bg, color: c.fg }}>
      <span className="badge-dot" />
      {label}
    </span>
  )
}
