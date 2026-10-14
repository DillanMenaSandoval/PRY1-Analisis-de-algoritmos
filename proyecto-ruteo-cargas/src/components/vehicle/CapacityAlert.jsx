import { CAPACITY_STATUS } from './capacityStatus.js';
import { formatNumber } from '../../utils/formatters.js';

function CapacityAlert({ capacityStatus }) {
  const { status, capacity, remaining, lightestWeight } = capacityStatus;

  if (status === CAPACITY_STATUS.FULL) {
    return (
      <p className="alert alert--warning" role="status">
        Capacidad alcanzada: el vehículo está lleno ({formatNumber(capacity)} de{' '}
        {formatNumber(capacity)}) y no cabe ningún pedido más.
      </p>
    );
  }

  if (status === CAPACITY_STATUS.EXHAUSTED) {
    return (
      <p className="alert alert--warning" role="status">
        Capacidad prácticamente agotada: quedan {formatNumber(remaining)} libres, pero el pedido
        más liviano sin cargar pesa {formatNumber(lightestWeight)}.
      </p>
    );
  }

  if (status === CAPACITY_STATUS.ALL_LOADED) {
    return (
      <p className="alert alert--info" role="status">
        Todos los pedidos caben en el vehículo: sobran {formatNumber(remaining)} de capacidad.
      </p>
    );
  }

  return null;
}

export default CapacityAlert;
