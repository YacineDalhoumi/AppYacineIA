import { NAV_ITEMS } from '../utils/constants'
import { IconMenu, IconLogout } from './Icons'
import { initials } from '../utils/format'
import { useAuth } from '../state/AuthContext'

export default function Topbar({ activePage, onOpenSidebar, userName }) {
  const current = NAV_ITEMS.find((item) => item.key === activePage)
  const { isDemoMode, logout } = useAuth()

  return (
    <header className="topbar">
      <button
        type="button"
        className="topbar-menu-btn"
        onClick={onOpenSidebar}
        aria-label="Ouvrir le menu"
      >
        <IconMenu size={18} />
      </button>
      <span className="topbar-title">{current?.label || ''}</span>
      {isDemoMode && (
        <span className="badge" style={{ background: 'var(--color-warning-soft)', color: 'var(--color-warning)' }}>
          Mode démo
        </span>
      )}
      <div className="topbar-spacer" />
      <div className="topbar-user">
        <span>{userName}</span>
        <span className="topbar-user-avatar">{initials(userName)}</span>
        {!isDemoMode && (
          <button type="button" className="btn-icon" title="Se déconnecter" onClick={logout}>
            <IconLogout size={16} />
          </button>
        )}
      </div>
    </header>
  )
}
