import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOccupancy,
  calculateTotalProfit,
  calculateTotalWeight,
  countDPStates,
  measureExecutionTime,
} from '../src/logic/metrics.js';

const orders = [
  { weight: 3, profit: 10 },
  { weight: 5, profit: 4 },
];

describe('metrics', () => {
  it('suma pesos y ganancias', () => {
    assert.equal(calculateTotalWeight(orders), 8);
    assert.equal(calculateTotalProfit(orders), 14);
    assert.equal(calculateTotalWeight([]), 0);
  });

  it('calcula la ocupación en porcentaje', () => {
    assert.equal(calculateOccupancy(8, 10), 80);
    assert.equal(calculateOccupancy(0, 0), 0);
  });

  it('cuenta los estados de la tabla DP como n · (W + 1)', () => {
    assert.equal(countDPStates(4, 7), 32);
    assert.equal(countDPStates(0, 100), 0);
  });

  it('devuelve el valor de la tarea y un tiempo no negativo', () => {
    const { value, executionTime } = measureExecutionTime(() => 42);

    assert.equal(value, 42);
    assert.ok(executionTime >= 0);
  });
});
