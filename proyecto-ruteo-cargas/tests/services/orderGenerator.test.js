import { describe, expect, it } from 'vitest';
import {
  createOrder,
  generateRandomOrders,
  suggestWeightRange,
} from '../../src/services/orderGenerator.js';
import { validateOrderInput } from '../../src/utils/validation.js';
import { createSeededRandom } from '../helpers/orders.js';

describe('generateRandomOrders', () => {
  it('genera la cantidad pedida con el modelo completo', () => {
    const orders = generateRandomOrders(25);

    expect(orders).toHaveLength(25);
    orders.forEach((order) => {
      expect(Object.keys(order).sort()).toEqual(['id', 'name', 'profit', 'weight', 'x', 'y']);
    });
  });

  it('genera pedidos válidos dentro de los rangos configurados', () => {
    const options = { minWeight: 2, maxWeight: 6, minProfit: 10, maxProfit: 20, coordinateRange: 50 };
    const orders = generateRandomOrders(200, options);

    orders.forEach((order) => {
      expect(validateOrderInput(order).errors).toEqual({});
      expect(Number.isInteger(order.weight)).toBe(true);
      expect(order.weight).toBeGreaterThanOrEqual(2);
      expect(order.weight).toBeLessThanOrEqual(6);
      expect(order.profit).toBeGreaterThanOrEqual(10);
      expect(order.profit).toBeLessThanOrEqual(20);
      expect(order.x).toBeGreaterThanOrEqual(0);
      expect(order.y).toBeLessThanOrEqual(50);
    });
  });

  it('asigna identificadores únicos, incluso entre llamadas', () => {
    const ids = [...generateRandomOrders(100), ...generateRandomOrders(100)].map((o) => o.id);
    expect(new Set(ids).size).toBe(200);
  });

  it('es reproducible con un generador con semilla', () => {
    const strip = (orders) => orders.map(({ id: _id, ...rest }) => rest);
    const first = generateRandomOrders(10, { random: createSeededRandom(7) });
    const second = generateRandomOrders(10, { random: createSeededRandom(7) });

    expect(strip(first)).toEqual(strip(second));
  });

  it('rechaza cantidades o rangos inválidos', () => {
    expect(() => generateRandomOrders(-1)).toThrow(RangeError);
    expect(() => generateRandomOrders(2.5)).toThrow(RangeError);
    expect(() => generateRandomOrders(3, { minWeight: 5, maxWeight: 2 })).toThrow(RangeError);
    expect(() => generateRandomOrders(3, { minWeight: 0 })).toThrow(RangeError);
  });

  it('devuelve una lista vacía para cantidad 0', () => {
    expect(generateRandomOrders(0)).toEqual([]);
  });
});

describe('suggestWeightRange', () => {
  it('limita el peso máximo a la mitad de la capacidad, con mínimo 1', () => {
    expect(suggestWeightRange(50)).toEqual({ minWeight: 1, maxWeight: 25 });
    expect(suggestWeightRange(1)).toEqual({ minWeight: 1, maxWeight: 1 });
  });
});

describe('createOrder', () => {
  it('recorta el nombre y agrega un id', () => {
    const order = createOrder({ name: '  Caja  ', weight: 1, profit: 2, x: 0, y: 0 });
    expect(order).toMatchObject({ name: 'Caja', weight: 1, profit: 2 });
    expect(order.id).toMatch(/^PED-/);
  });
});
