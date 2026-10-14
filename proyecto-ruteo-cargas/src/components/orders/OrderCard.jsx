import { formatCoordinates, formatNumber } from '../../utils/formatters.js';

function OrderCard({ order, position, isSelected, onRemove }) {
  return (
    <li className={`order-card${isSelected ? ' order-card--selected' : ''}`}>
      <span className="order-card__position" aria-hidden="true">
        {position}
      </span>
      <div className="order-card__body">
        <p className="order-card__name">
          {order.name}
          {isSelected && <span className="badge badge--success">Seleccionado</span>}
        </p>
        <p className="order-card__meta">
          {order.id} · Coord. {formatCoordinates(order.x, order.y)}
        </p>
      </div>
      <dl className="order-card__stats">
        <div>
          <dt>Peso</dt>
          <dd>{formatNumber(order.weight)}</dd>
        </div>
        <div>
          <dt>Ganancia</dt>
          <dd>{formatNumber(order.profit)}</dd>
        </div>
      </dl>
      <button
        type="button"
        className="button button--ghost-danger button--small order-card__remove"
        aria-label={`Eliminar ${order.name}`}
        onClick={() => onRemove(order.id)}
      >
        Eliminar
      </button>
    </li>
  );
}

export default OrderCard;
