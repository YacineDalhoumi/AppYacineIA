import { NAV_ITEMS } from '../utils/constants'
import {
  IconDashboard,
  IconTasks,
  IconProspects,
  IconPipeline,
  IconPayments,
  IconSettings,
} from './Icons'

const ICONS = {
  dashboard: IconDashboard,
  tasks: IconTasks,
  prospects: IconProspects,
  pipeline: IconPipeline,
  payments: IconPayments,
  settings: IconSettings,
}

export default function Sidebar({ activePage, onNavigate, isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar${isOpen ? ' is-open' : ''}`}>
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark">Y</span>
          <span className="sidebar-brand-name">Yacine</span>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.icon]
            return (
              <button
                key={item.key}
                type="button"
                className={`sidebar-link${activePage === item.key ? ' is-active' : ''}`}
                onClick={() => {
                  onNavigate(item.key)
                  onClose()
                }}
              >
                <span className="sidebar-link-icon">
                  <Icon size={18} />
                </span>
                {item.label}
              </button>
            )
          })}
        </nav>
        <div className="sidebar-footer">Suivi commercial &amp; paiements</div>
      </aside>
    </>
  )
}
