import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildDPTable, solveKnapsack } from '../src/logic/knapsackDP.js';
import { EXAMPLE_CASE, INPUT_LIMITS } from '../src/configuracion/config.js';
import { seededRandom } from './helpers/seededRandom.js';

function bruteForceMaxProfit(orders, capacity) {
  let best = 0;

  for (let mask = 0; mask < 1 << orders.length; mask += 1) {
    let weight = 0;
    let profit = 0;

    orders.forEach((order, index) => {
      if (mask & (1 << index)) {
        weight += order.weight;
        profit += order.profit;
      }
    });

    if (weight <= capacity) {
      best = Math.max(best, profit);
    }
  }

  return best;
}

function makeOrders(pairs) {
  return pairs.map(([weight, profit], index) => ({ id: `P-${index + 1}`, weight, profit }));
}

describe('solveKnapsack: resultados', () => {
  it('resuelve el caso de ejemplo de la configuración', () => {
    const result = solveKnapsack([...EXAMPLE_CASE.orders], EXAMPLE_CASE.capacity);

    assert.equal(result.maxProfit, 9);
    assert.deepEqual(
      result.selectedOrders.map((order) => order.id),
      ['EJ-2', 'EJ-3'],
    );
    assert.equal(result.totalWeight, 7);
    assert.equal(result.occupancy, 100);
    assert.equal(result.ordersProcessed, 4);
    assert.equal(result.statesExplored, 4 * (EXAMPLE_CASE.capacity + 1));
    assert.equal(result.tracePath.length, 4);
    assert.equal(result.dpTable.length, 5);
  });

  it('coincide con la fuerza bruta en instancias aleatorias', () => {
    const random = seededRandom(2026);

    for (let round = 0; round < 200; round += 1) {
      const count = Math.floor(random() * 11);
      const capacity = Math.floor(random() * 31);
      const orders = makeOrders(
        Array.from({ length: count }, () => [
          1 + Math.floor(random() * 15),
          1 + Math.floor(random() * 50),
        ]),
      );

      const result = solveKnapsack(orders, capacity);
      const selectedProfit = result.selectedOrders.reduce((sum, order) => sum + order.profit, 0);

      assert.equal(result.maxProfit, bruteForceMaxProfit(orders, capacity));
      assert.equal(selectedProfit, result.maxProfit);
      assert.ok(result.totalWeight <= capacity);
    }
  });

  it('devuelve una solución vacía sin pedidos o con capacidad 0', () => {
    assert.equal(solveKnapsack([], 10).maxProfit, 0);

    const result = solveKnapsack(makeOrders([[2, 5]]), 0);
    assert.equal(result.maxProfit, 0);
    assert.deepEqual(result.selectedOrders, []);
    assert.equal(result.occupancy, 0);
  });

  it('ignora pedidos más pesados que la capacidad', () => {
    const result = solveKnapsack(makeOrders([[20, 100], [3, 4]]), 10);

    assert.equal(result.maxProfit, 4);
    assert.deepEqual(
      result.selectedOrders.map((order) => order.id),
      ['P-2'],
    );
  });
});

describe('solveKnapsack: validaciones', () => {
  const invalidOrders = [
    ['ganancia 0', { weight: 2, profit: 0 }],
    ['ganancia negativa', { weight: 2, profit: -5 }],
    ['ganancia no numérica', { weight: 2, profit: Number.NaN }],
    ['ganancia infinita', { weight: 2, profit: Number.POSITIVE_INFINITY }],
    ['peso 0', { weight: 0, profit: 5 }],
    ['peso negativo', { weight: -1, profit: 5 }],
    ['peso decimal', { weight: 1.5, profit: 5 }],
    ['pedido nulo', null],
  ];

  for (const [label, order] of invalidOrders) {
    it(`rechaza ${label}`, () => {
      assert.throws(() => solveKnapsack([order], 10), RangeError);
    });
  }

  it('acepta ganancias positivas con decimales', () => {
    assert.equal(solveKnapsack([{ weight: 1, profit: 0.5 }], 1).maxProfit, 0.5);
  });

  it('rechaza pedidos que no son un arreglo', () => {
    assert.throws(() => solveKnapsack('pedidos', 10), TypeError);
  });

  it('rechaza capacidades negativas o decimales', () => {
    assert.throws(() => solveKnapsack([], -1), RangeError);
    assert.throws(() => solveKnapsack([], 2.5), RangeError);
  });
});

describe('Límites de la tabla DP', () => {
  const unitOrders = (count) => makeOrders(Array.from({ length: count }, () => [1, 1]));

  it('rechaza una capacidad mayor que maxCapacity', () => {
    assert.throws(() => solveKnapsack([], INPUT_LIMITS.maxCapacity + 1), /capacidad no puede superar/);
  });

  it('rechaza más pedidos que maxOrders', () => {
    assert.throws(
      () => solveKnapsack(unitOrders(INPUT_LIMITS.maxOrders + 1), 1),
      /más de 500 pedidos/,
    );
  });

  it('rechaza tablas con más estados que maxDPStates', () => {
    assert.throws(
      () => solveKnapsack(unitOrders(INPUT_LIMITS.maxOrders), INPUT_LIMITS.maxCapacity),
      /máximo permitido es 5000000/,
    );
  });

  it('comprueba los límites antes de reservar memoria', () => {
    const OriginalFloat64Array = globalThis.Float64Array;
    let allocations = 0;

    globalThis.Float64Array = class extends OriginalFloat64Array {
      constructor(...args) {
        super(...args);
        allocations += 1;
      }
    };

    try {
      assert.throws(
        () => buildDPTable(unitOrders(INPUT_LIMITS.maxOrders), INPUT_LIMITS.maxCapacity),
        RangeError,
      );
      assert.throws(() => buildDPTable([], INPUT_LIMITS.maxCapacity + 1), RangeError);
    } finally {
      globalThis.Float64Array = OriginalFloat64Array;
    }

    assert.equal(allocations, 0);
  });

  it('permite una tabla con exactamente maxDPStates estados', () => {
    const capacity = INPUT_LIMITS.maxCapacity - 1;
    const count = INPUT_LIMITS.maxDPStates / (capacity + 1);
    const result = solveKnapsack(unitOrders(count), capacity);

    assert.equal(result.statesExplored, INPUT_LIMITS.maxDPStates);
    assert.equal(result.maxProfit, count);
  });
});
