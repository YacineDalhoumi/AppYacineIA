// Icônes minimalistes en SVG inline (trait, 1.8px), sans dépendance externe.
// `size` et `color` héritent par défaut du texte courant.

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Svg({ children, size = 18, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>
      {children}
    </svg>
  )
}

export function IconDashboard(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </Svg>
  )
}

export function IconTasks(props) {
  return (
    <Svg {...props}>
      <path d="M9 6h11" />
      <path d="M9 12h11" />
      <path d="M9 18h11" />
      <path d="M4 6l1.2 1.2L7.5 4.7" />
      <path d="M4 12l1.2 1.2L7.5 10.7" />
      <path d="M4 18l1.2 1.2L7.5 16.7" />
    </Svg>
  )
}

export function IconProspects(props) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
      <path d="M16.5 4.5c1.6.4 2.8 1.9 2.8 3.6 0 1.7-1.2 3.2-2.8 3.6" />
      <path d="M18 14.3c2 .5 3.5 2.2 3.5 4.3" />
    </Svg>
  )
}

export function IconPipeline(props) {
  return (
    <Svg {...props}>
      <circle cx="5" cy="6" r="2.2" />
      <circle cx="12" cy="12" r="2.2" />
      <circle cx="19" cy="18" r="2.2" />
      <path d="M6.6 7.4L10.4 10.6" />
      <path d="M13.6 13.4L17.4 16.6" />
    </Svg>
  )
}

export function IconPayments(props) {
  return (
    <Svg {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
      <path d="M2.5 10h19" />
      <path d="M6 14.5h4" />
    </Svg>
  )
}

export function IconSettings(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a7.6 7.6 0 000-3l1.9-1.4-2-3.4-2.2.8a7.6 7.6 0 00-2.6-1.5L14 2.5h-4l-.5 2.5a7.6 7.6 0 00-2.6 1.5l-2.2-.8-2 3.4L4.6 10.5a7.6 7.6 0 000 3L2.7 15l2 3.4 2.2-.8c.8.7 1.7 1.2 2.6 1.5l.5 2.4h4l.5-2.4a7.6 7.6 0 002.6-1.5l2.2.8 2-3.4-1.9-1.5z" />
    </Svg>
  )
}

export function IconMenu(props) {
  return (
    <Svg {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </Svg>
  )
}

export function IconClose(props) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </Svg>
  )
}

export function IconSearch(props) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </Svg>
  )
}

export function IconPlus(props) {
  return (
    <Svg {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Svg>
  )
}

export function IconEdit(props) {
  return (
    <Svg {...props}>
      <path d="M4 20l4.2-.9 10-10a2.2 2.2 0 00-3.3-3.3l-10 10L4 20z" />
      <path d="M13 6.3l3.7 3.7" />
    </Svg>
  )
}

export function IconTrash(props) {
  return (
    <Svg {...props}>
      <path d="M4 7h16" />
      <path d="M9 7V4.5A1.5 1.5 0 0110.5 3h3A1.5 1.5 0 0115 4.5V7" />
      <path d="M6 7l1 13.5A1.5 1.5 0 008.5 22h7a1.5 1.5 0 001.5-1.5L18 7" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </Svg>
  )
}

export function IconUsersClock(props) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="7.5" r="3" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5" />
      <circle cx="17" cy="16" r="5" />
      <path d="M17 13.5V16l1.6 1" />
    </Svg>
  )
}

export function IconTrendUp(props) {
  return (
    <Svg {...props}>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 6h6v6" />
    </Svg>
  )
}

export function IconAlert(props) {
  return (
    <Svg {...props}>
      <path d="M12 3l10 18H2z" />
      <path d="M12 10v4" />
      <path d="M12 17.2v.1" />
    </Svg>
  )
}

export function IconWallet(props) {
  return (
    <Svg {...props}>
      <path d="M3 7.5A2.5 2.5 0 015.5 5H18a2 2 0 012 2v2.5" />
      <rect x="3" y="8" width="18" height="12" rx="2.2" />
      <path d="M15.5 14a1.8 1.8 0 000 3.6H20V14z" />
    </Svg>
  )
}

export function IconClockAlert(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2" />
      <path d="M9 2.5h6" />
    </Svg>
  )
}

export function IconInbox(props) {
  return (
    <Svg {...props}>
      <path d="M3.5 12h4.5l1.5 3h5l1.5-3h4.5" />
      <path d="M5.5 6h13l2 6v6.5a1.5 1.5 0 01-1.5 1.5h-14A1.5 1.5 0 013.5 18.5V12z" />
    </Svg>
  )
}

export function IconCheck(props) {
  return (
    <Svg {...props}>
      <path d="M4 12.5l5 5L20 6.5" />
    </Svg>
  )
}

export function IconFileInvoice(props) {
  return (
    <Svg {...props}>
      <path d="M7 3.5h7l4 4V19a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 016 19V5A1.5 1.5 0 017 3.5z" />
      <path d="M14 3.5V8h4.5" />
      <path d="M9 12.5h6" />
      <path d="M9 15.5h6" />
    </Svg>
  )
}
