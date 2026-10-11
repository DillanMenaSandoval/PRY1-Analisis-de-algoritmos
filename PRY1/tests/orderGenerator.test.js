import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createOrder,
  generateRandomOrders,
  suggestWeightRange,
} from '../src/services/orderGenerator.js';
import { solveKnapsack } from '../src/logic/knapsackDP.js';
import { RANDOM_GENERATOR_DEFAULTS } from '../src/configuracion/config.js';
import { seededRandom } from './helpers/seededRandom.js';

describe('generateRandomOrders', () => {
  it('genera la cantidad pedida con pesos y ganancias enteros dentro del rango', () => {
    const orders = generateRandomOrders(50, { random: seededRandom(7) });
    const { minWeight, maxWeight, minProfit, maxProfit, coordinateRange } =
      RANDOM_GENERATOR_DEFAULTS;

    assert.equal(orders.length, 50);

    for (const order of orders) {
      assert.ok(Number.isInteger(order.weight));
      assert.ok(Number.isInteger(order.profit));
      assert.ok(order.weight >= minWeight && order.weight <= maxWeight);
      assert.ok(order.profit >= minProfit && order.profit <= maxProfit);
      assert.ok(order.x >= 0 && order.x <= coordinateRange);
      assert.ok(order.y >= 0 && order.y <= coordinateRange);
    }
  });

  it('asigna identificadores únicos y nombres secuenciales', () => {
    const orders = generateRandomOrders(3, { startIndex: 9, random: seededRandom(1) });

    assert.equal(new Set(orders.map((order) => order.id)).size, 3);
    assert.deepEqual(
      orders.map((order) => order.name),
      ['Pedido 009', 'Pedido 010', 'Pedido 011'],
    );
  });

  it('es reproducible con la misma semilla', () => {
    const values = (orders) => orders.map(({ weight, profit, x, y }) => [weight, profit, x, y]);

    assert.deepEqual(
      values(generateRandomOrders(10, { random: seededRandom(42) })),
      values(generateRandomOrders(10, { random: seededRandom(42) })),
    );
  });

  it('respeta los rangos personalizados', () => {
    const orders = generateRandomOrders(20, {
      minWeight: 4,
      maxWeight: 4,
      minProfit: 9,
      maxProfit: 9,
      random: seededRandom(3),
    });

    assert.ok(orders.every((order) => order.weight === 4 && order.profit === 9));
  });

  it('devuelve un arreglo vacío si la cantidad es 0', () => {
    assert.deepEqual(generateRandomOrders(0), []);
  });

  it('genera pedidos que el algoritmo acepta', () => {
    const orders = generateRandomOrders(30, { random: seededRandom(11) });
    assert.doesNotThrow(() => solveKnapsack(orders, 50));
  });

  it('rechaza cantidades inválidas', () => {
    assert.throws(() => generateRandomOrders(-1), RangeError);
    assert.throws(() => generateRandomOrders(1.5), RangeError);
  });

  const invalidRanges = [
    ['peso mínimo 0', { minWeight: 0 }],
    ['ganancia mínima 0', { minProfit: 0 }],
    ['peso mínimo mayor que el máximo', { minWeight: 10, maxWeight: 5 }],
    ['ganancia mínima mayor que la máxima', { minProfit: 10, maxProfit: 5 }],
    ['peso decimal', { minWeight: 1.5 }],
    ['ganancia decimal', { maxProfit: 7.5 }],
  ];

  for (const [label, options] of invalidRanges) {
    it(`rechaza el rango con ${label}`, () => {
      assert.throws(() => generateRandomOrders(1, options), RangeError);
    });
  }
});

describe('createOrder', () => {
  it('crea un pedido con identificador y nombre sin espacios sobrantes', () => {
    const order = createOrder({ name: '  Pedido Centro  ', weight: 3, profit: 8, x: 1, y: 2 });

    assert.match(order.id, /^PED-/);
    assert.equal(order.name, 'Pedido Centro');
    assert.deepEqual(
      { weight: order.weight, profit: order.profit, x: order.x, y: order.y },
      { weight: 3, profit: 8, x: 1, y: 2 },
    );
  });
});

describe('suggestWeightRange', () => {
  it('sugiere un peso máximo de la mitad de la capacidad', () => {
    assert.deepEqual(suggestWeightRange(50), { minWeight: 1, maxWeight: 25 });
  });

  it('nunca sugiere un máximo menor que el mínimo', () => {
    assert.deepEqual(suggestWeightRange(1), { minWeight: 1, maxWeight: 1 });
  });
});
