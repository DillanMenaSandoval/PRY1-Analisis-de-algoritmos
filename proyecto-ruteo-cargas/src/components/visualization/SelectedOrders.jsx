import { formatCoordinates, formatNumber } from '../../utils/formatters.js';
import './visualization.css';

function SelectedOrders({ orders }) {
  if (orders.length === 0) {
    return <p className="empty-state">Ningún pedido cabe en el vehículo con esta capacidad.</p>;
  }

  return (
    <div className="table-scroll selected-orders__scroll">
      <table className="data-table">
        <caption className="visually-hidden">Pedidos seleccionados por el algoritmo</caption>
        <thead>
          <tr>
            <th scope="col">Pedido</th>
            <th scope="col" className="data-table__numeric">Peso</th>
            <th scope="col" className="data-table__numeric">Ganancia</th>
            <th scope="col" className="data-table__numeric">Coordenadas</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <th scope="row">{order.name}</th>
              <td className="data-table__numeric">{formatNumber(order.weight)}</td>
              <td className="data-table__numeric">{formatNumber(order.profit)}</td>
              <td className="data-table__numeric">{formatCoordinates(order.x, order.y)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SelectedOrders;
