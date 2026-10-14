import { describe, expect, it } from 'vitest';
import { buildDPTable } from '../../src/algorithms/dynamicProgramming/knapsackDP.js';
import {
  PLAYBACK_UNITS,
  buildTraceLookup,
  explainCell,
  getCurrentCell,
  getNextStep,
  getPageCount,
  getPageRange,
  isCellFilled,
} from '../../src/components/visualization/dpTableModel.js';
import { makeOrders } from '../helpers/orders.js';

const orders = makeOrders([
  [1, 1],
  [3, 4],
  [4, 5],
  [5, 7],
]);
const { dpTable } = buildDPTable(orders, 7);

describe('paginación', () => {
  it('calcula rangos y cantidad de bloques', () => {
    expect(getPageRange(0, 26, 8)).toEqual({ start: 0, end: 8 });
    expect(getPageRange(2, 26, 60)).toEqual({ start: 52, end: 60 });
    expect(getPageCount(26, 60)).toBe(3);
    expect(getPageCount(26, 1)).toBe(1);
  });
});

describe('explainCell', () => {
  it('describe el caso base', () => {
    expect(explainCell(dpTable, orders, 0, 5)).toMatchObject({ value: 0, decision: 'base' });
  });

  it('hereda el valor cuando el pedido no cabe', () => {
    const explanation = explainCell(dpTable, orders, 4, 3);

    expect(explanation.decision).toBe('does-not-fit');
    expect(explanation.dependencies).toEqual([{ row: 3, capacity: 3 }]);
    expect(explanation.value).toBe(dpTable[3][3]);
  });

  it('explica una inclusión con sus dos dependencias', () => {
    const explanation = explainCell(dpTable, orders, 3, 7);

    expect(explanation).toMatchObject({ decision: 'include', withoutOrder: 5, withOrder: 9, value: 9 });
    expect(explanation.dependencies).toEqual([
      { row: 2, capacity: 7 },
      { row: 2, capacity: 3 },
    ]);
  });

  it('explica una exclusión', () => {
    expect(explainCell(dpTable, orders, 4, 7)).toMatchObject({
      decision: 'exclude',
      withoutOrder: 9,
      withOrder: 8,
    });
  });
});

describe('buildTraceLookup', () => {
  it('indexa las celdas del camino de reconstrucción', () => {
    const lookup = buildTraceLookup([
      { row: 2, capacity: 3, taken: true },
      { row: 1, capacity: 0, taken: false },
    ]);

    expect(lookup.get('2:3')).toBe(true);
    expect(lookup.get('1:0')).toBe(false);
    expect(lookup.has('0:0')).toBe(false);
  });
});

describe('visualización paso a paso', () => {
  const totalColumns = 8;
  const totalCells = 5 * totalColumns;

  it('ubica la celda actual a partir de las celdas calculadas', () => {
    expect(getCurrentCell(0, totalColumns)).toBeNull();
    expect(getCurrentCell(1, totalColumns)).toEqual({ row: 0, capacity: 0 });
    expect(getCurrentCell(8, totalColumns)).toEqual({ row: 0, capacity: 7 });
    expect(getCurrentCell(9, totalColumns)).toEqual({ row: 1, capacity: 0 });
    expect(getCurrentCell(totalCells, totalColumns)).toEqual({ row: 4, capacity: 7 });
  });

  it('marca como calculadas solo las celdas anteriores al paso', () => {
    expect(isCellFilled(0, 0, 0, totalColumns)).toBe(false);
    expect(isCellFilled(0, 0, 1, totalColumns)).toBe(true);
    expect(isCellFilled(1, 0, 8, totalColumns)).toBe(false);
    expect(isCellFilled(1, 0, 9, totalColumns)).toBe(true);
  });

  it('avanza de a una celda', () => {
    expect(getNextStep(0, totalCells, totalColumns, PLAYBACK_UNITS.CELL)).toBe(1);
    expect(getNextStep(12, totalCells, totalColumns, PLAYBACK_UNITS.CELL)).toBe(13);
  });

  it('avanza hasta completar la fila actual o la siguiente', () => {
    expect(getNextStep(0, totalCells, totalColumns, PLAYBACK_UNITS.ROW)).toBe(8);
    expect(getNextStep(5, totalCells, totalColumns, PLAYBACK_UNITS.ROW)).toBe(8);
    expect(getNextStep(8, totalCells, totalColumns, PLAYBACK_UNITS.ROW)).toBe(16);
  });

  it('nunca supera el total de celdas', () => {
    expect(getNextStep(totalCells - 1, totalCells, totalColumns, PLAYBACK_UNITS.CELL)).toBe(totalCells);
    expect(getNextStep(totalCells - 3, totalCells, totalColumns, PLAYBACK_UNITS.ROW)).toBe(totalCells);
    expect(getNextStep(totalCells, totalCells, totalColumns, PLAYBACK_UNITS.CELL)).toBe(totalCells);
  });
});
