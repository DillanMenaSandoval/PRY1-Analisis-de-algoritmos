import { reconstructSolution } from './reconstructSolution.js';
import {
  calculateOccupancy,
  calculateTotalWeight,
  measureExecutionTime,
} from './metrics.js';

function assertValidInput(orders, capacity) {
  if (!Array.isArray(orders)) {
    throw new TypeError('Los pedidos deben proporcionarse como un arreglo.');
  }

  if (!Number.isInteger(capacity) || capacity < 0) {
    throw new RangeError('La capacidad debe ser un entero mayor o igual a 0.');
  }

  orders.forEach((order, index) => {
    if (!Number.isInteger(order?.weight) || order.weight <= 0) {
      throw new RangeError(`El pedido en la posición ${index} tiene un peso inválido.`);
    }

    if (!Number.isFinite(order.profit) || order.profit < 0) {
      throw new RangeError(`El pedido en la posición ${index} tiene una ganancia inválida.`);
    }
  });
}

/**
 * Construye la tabla completa DP[0..n][0..W] donde DP[i][w] es la ganancia máxima
 * usando los primeros i pedidos con capacidad w.
 *
 * Cada fila es un Float64Array: memoria contigua y predecible (8 bytes por estado).
 */
export function buildDPTable(orders, capacity) {
  const dpTable = [new Float64Array(capacity + 1)];
  let statesExplored = 0;

  for (let row = 1; row <= orders.length; row += 1) {
    const { weight, profit } = orders[row - 1];
    const previousRow = dpTable[row - 1];
    const currentRow = new Float64Array(capacity + 1);

    for (let w = 0; w <= capacity; w += 1) {
      const profitWithout = previousRow[w];
      currentRow[w] =
        weight <= w ? Math.max(profitWithout, profit + previousRow[w - weight]) : profitWithout;
      statesExplored += 1;
    }

    dpTable.push(currentRow);
  }

  return { dpTable, statesExplored };
}

/**
 * Resuelve la Mochila 0/1 exacta para los pedidos y la capacidad dados.
 *
 * @param {{ id: string, name: string, weight: number, profit: number, x: number, y: number }[]} orders
 * @param {number} capacity Capacidad entera del vehículo (W).
 */
export function solveKnapsack(orders, capacity) {
  assertValidInput(orders, capacity);

  const { value, executionTime } = measureExecutionTime(() => {
    const { dpTable, statesExplored } = buildDPTable(orders, capacity);
    const { selectedOrders, tracePath } = reconstructSolution(dpTable, orders, capacity);
    return { dpTable, statesExplored, selectedOrders, tracePath };
  });

  const { dpTable, statesExplored, selectedOrders, tracePath } = value;
  const totalWeight = calculateTotalWeight(selectedOrders);

  return {
    maxProfit: dpTable[orders.length][capacity],
    totalWeight,
    selectedOrders,
    dpTable,
    statesExplored,
    executionTime,
    capacity,
    ordersProcessed: orders.length,
    occupancy: calculateOccupancy(totalWeight, capacity),
    tracePath,
  };
}
