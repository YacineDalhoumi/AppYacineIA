import { IconInbox } from './Icons'

export default function EmptyState({ title = 'Rien à afficher', message, icon }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">{icon || <IconInbox size={20} />}</span>
      <span className="empty-state-title">{title}</span>
      {message && <span>{message}</span>}
    </div>
  )
}
