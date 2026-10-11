import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <p className="header__eyebrow">Análisis de Algoritmos · Proyecto 1</p>
        <h1 className="header__title">Ruteo y Planificación de Cargas</h1>
        <p className="header__description">
          Administra pedidos de entrega, define la capacidad del vehículo y selecciona los pedidos
          más convenientes mediante un algoritmo de optimización.
        </p>
      </div>
    </header>
  )
}

export default Header
