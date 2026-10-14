export const CAPACITY_STATUS = Object.freeze({
  FULL: 'full',
  EXHAUSTED: 'exhausted',
  ALL_LOADED: 'all-loaded',
  AVAILABLE: 'available',
});

/**
 * Evalúa qué tan cerca quedó el vehículo de su capacidad máxima tras ejecutar el algoritmo.
 *
 * - full: el peso cargado es igual a la capacidad.
 * - exhausted: queda espacio libre, pero ningún pedido sin cargar cabe en él.
 * - all-loaded: se cargaron todos los pedidos y sobra capacidad.
 * - available: todavía cabría al menos un pedido sin cargar.
 *
 * @returns {{ status: string, capacity: number, remaining: number, lightestWeight: number | null }}
 */
export function getCapacityStatus({ totalWeight, capacity, selectedOrders }, orders) {
  const remaining = capacity - totalWeight;

  if (remaining === 0) {
    return { status: CAPACITY_STATUS.FULL, capacity, remaining, lightestWeight: null };
  }

  const selectedIds = new Set(selectedOrders.map((order) => order.id));
  const unselectedOrders = orders.filter((order) => !selectedIds.has(order.id));

  if (unselectedOrders.length === 0) {
    return { status: CAPACITY_STATUS.ALL_LOADED, capacity, remaining, lightestWeight: null };
  }

  const lightestWeight = Math.min(...unselectedOrders.map((order) => order.weight));
  const status = lightestWeight > remaining ? CAPACITY_STATUS.EXHAUSTED : CAPACITY_STATUS.AVAILABLE;

  return { status, capacity, remaining, lightestWeight };
}
