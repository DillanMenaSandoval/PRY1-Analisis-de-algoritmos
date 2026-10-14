import OrderCard from './OrderCard.jsx';
import {
  calculateTotalProfit,
  calculateTotalWeight,
} from '../../algorithms/dynamicProgramming/metrics.js';
import { formatNumber } from '../../utils/formatters.js';
import './orders.css';

function OrderList({ orders, selectedOrderIds, onRemoveOrder }) {
  if (orders.length === 0) {
    return (
      <p className="empty-state">
        No hay pedidos. Agrega uno manualmente, genera pedidos aleatorios o carga el ejemplo.
      </p>
    );
  }

  return (
    <>
      <p className="order-list__summary">
        {formatNumber(orders.length)} pedidos · Peso total {formatNumber(calculateTotalWeight(orders))}
        {' · '}Ganancia total {formatNumber(calculateTotalProfit(orders))}
      </p>
      <ul className="order-list">
        {orders.map((order, index) => (
          <OrderCard
            key={order.id}
            order={order}
            position={index + 1}
            isSelected={selectedOrderIds.has(order.id)}
            onRemove={onRemoveOrder}
          />
        ))}
      </ul>
    </>
  );
}

export default OrderList;
