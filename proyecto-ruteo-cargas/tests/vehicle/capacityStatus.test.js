import { describe, expect, it } from 'vitest';
import { solveKnapsack } from '../../src/algorithms/dynamicProgramming/knapsackDP.js';
import {
  CAPACITY_STATUS,
  getCapacityStatus,
} from '../../src/components/vehicle/capacityStatus.js';
import { makeOrders } from '../helpers/orders.js';

function statusFor(pairs, capacity) {
  const orders = makeOrders(pairs);
  return getCapacityStatus(solveKnapsack(orders, capacity), orders);
}

describe('getCapacityStatus', () => {
  it('detecta que el vehículo quedó lleno', () => {
    expect(statusFor([[3, 4], [4, 5]], 7)).toMatchObject({
      status: CAPACITY_STATUS.FULL,
      remaining: 0,
    });
  });

  it('detecta que ningún pedido sin cargar cabe en el espacio libre', () => {
    expect(statusFor([[5, 10], [4, 3]], 6)).toEqual({
      status: CAPACITY_STATUS.EXHAUSTED,
      capacity: 6,
      remaining: 1,
      lightestWeight: 4,
    });
  });

  it('detecta que se cargaron todos los pedidos con capacidad de sobra', () => {
    expect(statusFor([[1, 1], [2, 2]], 10)).toMatchObject({
      status: CAPACITY_STATUS.ALL_LOADED,
      remaining: 7,
    });
  });

  it('indica que todavía cabe un pedido si el resultado no es óptimo', () => {
    const orders = makeOrders([[2, 5], [3, 5]]);
    const partialResult = { totalWeight: 2, capacity: 10, selectedOrders: [orders[0]] };

    expect(getCapacityStatus(partialResult, orders).status).toBe(CAPACITY_STATUS.AVAILABLE);
  });
});
