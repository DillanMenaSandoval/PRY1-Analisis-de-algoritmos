import './EmptyState.css'

function EmptyState({ title, message }) {
  return (
    <div className="empty-state">
      <p className="empty-state__title">{title}</p>
      {message && <p className="empty-state__message">{message}</p>}
    </div>
  )
}

export default EmptyState
