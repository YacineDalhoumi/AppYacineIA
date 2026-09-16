import { NAV_ITEMS } from '../utils/constants'
import { IconMenu } from './Icons'
import { initials } from '../utils/format'

export default function Topbar({ activePage, onOpenSidebar, userName }) {
  const current = NAV_ITEMS.find((item) => item.key === activePage)

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
      <div className="topbar-spacer" />
      <div className="topbar-user">
        <span>{userName}</span>
        <span className="topbar-user-avatar">{initials(userName)}</span>
      </div>
    </header>
  )
}
