import './Panel.css'

function Panel({ title, description, badge, children }) {
  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2 className="panel__title">{title}</h2>
          {description && <p className="panel__description">{description}</p>}
        </div>
        {badge && <span className="panel__badge">{badge}</span>}
      </header>
      <div className="panel__body">{children}</div>
    </section>
  )
}

export default Panel
