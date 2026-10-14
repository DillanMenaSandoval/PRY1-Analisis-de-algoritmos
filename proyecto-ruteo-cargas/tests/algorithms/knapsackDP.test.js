import { describe, expect, it } from 'vitest';
import { buildDPTable, solveKnapsack } from '../../src/algorithms/dynamicProgramming/knapsackDP.js';
import { reconstructSolution } from '../../src/algorithms/dynamicProgramming/reconstructSolution.js';
import {
  bruteForceMaxProfit,
  createSeededRandom,
  makeOrders,
  sumBy,
} from '../helpers/orders.js';

function expectConsistentSolution(result, orders, capacity) {
  const selectedIds = result.selectedOrders.map((order) => order.id);

  expect(result.totalWeight).toBeLessThanOrEqual(capacity);
  expect(result.totalWeight).toBe(sumBy(result.selectedOrders, 'weight'));
  expect(sumBy(result.selectedOrders, 'profit')).toBe(result.maxProfit);
  expect(new Set(selectedIds).size).toBe(selectedIds.length);
  result.selectedOrders.forEach((order) => expect(orders).toContain(order));
}

describe('solveKnapsack', () => {
  it('resuelve el caso simple del enunciado', () => {
    const orders = makeOrders([
      [1, 1],
      [3, 4],
      [4, 5],
      [5, 7],
    ]);

    const result = solveKnapsack(orders, 7);

    expect(result.maxProfit).toBe(9);
    expect(result.totalWeight).toBe(7);
    expect(result.selectedOrders.map((order) => order.id)).toEqual(['T-2', 'T-3']);
    expectConsistentSolution(result, orders, 7);
  });

  it('construye la tabla DP esperada para el caso simple', () => {
    const orders = makeOrders([
      [1, 1],
      [3, 4],
      [4, 5],
      [5, 7],
    ]);

    const { dpTable } = solveKnapsack(orders, 7);

    expect(dpTable.map((row) => Array.from(row))).toEqual([
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 4, 5, 5, 5, 5],
      [0, 1, 1, 4, 5, 6, 6, 9],
      [0, 1, 1, 4, 5, 7, 8, 9],
    ]);
  });

  it('usa la capacidad exacta cuando la combinación óptima la llena', () => {
    const orders = makeOrders([
      [2, 3],
      [3, 4],
      [5, 8],
    ]);

    const result = solveKnapsack(orders, 10);

    expect(result.maxProfit).toBe(15);
    expect(result.totalWeight).toBe(10);
    expect(result.occupancy).toBe(100);
    expectConsistentSolution(result, orders, 10);
  });

  it('no selecciona nada cuando ningún pedido cabe', () => {
    const orders = makeOrders([
      [8, 10],
      [9, 20],
      [12, 30],
    ]);

    const result = solveKnapsack(orders, 5);

    expect(result.maxProfit).toBe(0);
    expect(result.totalWeight).toBe(0);
    expect(result.selectedOrders).toEqual([]);
    expect(result.occupancy).toBe(0);
  });

  it('maneja un solo pedido que cabe y uno que no cabe', () => {
    const [order] = makeOrders([[4, 11]]);

    expect(solveKnapsack([order], 4).selectedOrders).toEqual([order]);
    expect(solveKnapsack([order], 3).selectedOrders).toEqual([]);
    expect(solveKnapsack([order], 4).maxProfit).toBe(11);
  });

  it('resuelve empates de ganancia de forma determinista', () => {
    const orders = makeOrders([
      [3, 10],
      [3, 10],
      [3, 10],
    ]);

    const first = solveKnapsack(orders, 3);
    const second = solveKnapsack(orders, 3);

    expect(first.maxProfit).toBe(10);
    expect(first.selectedOrders).toHaveLength(1);
    expect(first.selectedOrders.map((order) => order.id)).toEqual(['T-1']);
    expect(second.selectedOrders).toEqual(first.selectedOrders);
    expectConsistentSolution(first, orders, 3);
  });

  it('elige todos los pedidos cuando la capacidad supera la suma de pesos', () => {
    const orders = makeOrders([
      [2, 5],
      [4, 9],
      [1, 3],
    ]);

    const result = solveKnapsack(orders, 100);

    expect(result.selectedOrders).toEqual(orders);
    expect(result.maxProfit).toBe(17);
    expect(result.totalWeight).toBe(7);
    expect(result.occupancy).toBeCloseTo(7);
  });

  it('devuelve un resultado vacío para una lista vacía', () => {
    const result = solveKnapsack([], 10);

    expect(result.maxProfit).toBe(0);
    expect(result.totalWeight).toBe(0);
    expect(result.selectedOrders).toEqual([]);
    expect(result.statesExplored).toBe(0);
    expect(result.ordersProcessed).toBe(0);
    expect(result.dpTable).toHaveLength(1);
    expect(Array.from(result.dpTable[0])).toEqual(new Array(11).fill(0));
  });

  it('acepta ganancias decimales', () => {
    const orders = makeOrders([
      [2, 1.5],
      [2, 2.25],
      [3, 3.1],
    ]);

    const result = solveKnapsack(orders, 4);

    expect(result.maxProfit).toBeCloseTo(3.75);
    expectConsistentSolution(result, orders, 4);
  });

  it('coincide con fuerza bruta en 200 casos aleatorios', () => {
    const random = createSeededRandom(20260928);
    const randomInt = (min, max) => Math.floor(random() * (max - min + 1)) + min;

    for (let trial = 0; trial < 200; trial += 1) {
      const orderCount = randomInt(0, 10);
      const orders = makeOrders(
        Array.from({ length: orderCount }, () => [randomInt(1, 15), randomInt(1, 50)]),
      );
      const capacity = randomInt(0, 40);

      const result = solveKnapsack(orders, capacity);

      expect(result.maxProfit).toBe(bruteForceMaxProfit(orders, capacity));
      expectConsistentSolution(result, orders, capacity);
    }
  });

  it('reporta métricas consistentes', () => {
    const orders = makeOrders([
      [1, 1],
      [3, 4],
      [4, 5],
    ]);

    const result = solveKnapsack(orders, 9);

    expect(result.statesExplored).toBe(orders.length * (9 + 1));
    expect(result.ordersProcessed).toBe(3);
    expect(result.capacity).toBe(9);
    expect(result.executionTime).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(result.executionTime)).toBe(true);
    expect(result.occupancy).toBeCloseTo((result.totalWeight / 9) * 100);
  });

  it('no modifica los pedidos de entrada', () => {
    const orders = makeOrders([
      [2, 3],
      [3, 4],
    ]);
    const snapshot = structuredClone(orders);

    solveKnapsack(orders, 5);

    expect(orders).toEqual(snapshot);
  });

  it.each([
    ['capacidad negativa', [], -1],
    ['capacidad decimal', [], 2.5],
    ['capacidad NaN', [], Number.NaN],
    ['capacidad infinita', [], Number.POSITIVE_INFINITY],
    ['peso cero', makeOrders([[0, 5]]), 5],
    ['peso negativo', makeOrders([[-2, 5]]), 5],
    ['peso decimal', makeOrders([[1.5, 5]]), 5],
    ['ganancia negativa', makeOrders([[2, -5]]), 5],
    ['ganancia NaN', makeOrders([[2, Number.NaN]]), 5],
    ['ganancia infinita', makeOrders([[2, Number.POSITIVE_INFINITY]]), 5],
  ])('rechaza entradas inválidas: %s', (_, orders, capacity) => {
    expect(() => solveKnapsack(orders, capacity)).toThrow(RangeError);
  });

  it('rechaza pedidos que no son un arreglo', () => {
    expect(() => solveKnapsack(null, 5)).toThrow(TypeError);
  });
});

describe('buildDPTable', () => {
  it('crea n + 1 filas de W + 1 columnas y cuenta n · (W + 1) estados', () => {
    const orders = makeOrders([
      [1, 2],
      [2, 3],
      [3, 4],
    ]);

    const { dpTable, statesExplored } = buildDPTable(orders, 6);

    expect(dpTable).toHaveLength(4);
    dpTable.forEach((row) => expect(row).toHaveLength(7));
    expect(statesExplored).toBe(21);
  });

  it('produce filas monótonas no decrecientes en la capacidad', () => {
    const orders = makeOrders([
      [3, 7],
      [2, 4],
      [5, 11],
      [1, 1],
    ]);

    const { dpTable } = buildDPTable(orders, 12);

    dpTable.forEach((row) => {
      for (let w = 1; w < row.length; w += 1) {
        expect(row[w]).toBeGreaterThanOrEqual(row[w - 1]);
      }
    });
  });
});

describe('reconstructSolution', () => {
  it('devuelve un camino con una decisión por pedido', () => {
    const orders = makeOrders([
      [1, 1],
      [3, 4],
      [4, 5],
      [5, 7],
    ]);
    const { dpTable } = buildDPTable(orders, 7);

    const { selectedOrders, tracePath } = reconstructSolution(dpTable, orders, 7);

    expect(tracePath).toEqual([
      { row: 4, capacity: 7, taken: false },
      { row: 3, capacity: 7, taken: true },
      { row: 2, capacity: 3, taken: true },
      { row: 1, capacity: 0, taken: false },
    ]);
    expect(selectedOrders.map((order) => order.id)).toEqual(['T-2', 'T-3']);
  });
});
