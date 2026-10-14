export function cellKey(row, capacity) {
  return `${row}:${capacity}`;
}

export function getPageRange(pageIndex, pageSize, totalItems) {
  const start = pageIndex * pageSize;
  return { start, end: Math.min(start + pageSize, totalItems) };
}

export function getPageCount(pageSize, totalItems) {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

export function buildTraceLookup(tracePath) {
  return new Map(tracePath.map(({ row, capacity, taken }) => [cellKey(row, capacity), taken]));
}

/**
 * Describe cómo se obtuvo DP[row][capacity] y qué celdas de la fila anterior consultó.
 */
export function explainCell(dpTable, orders, row, capacity) {
  const value = dpTable[row][capacity];

  if (row === 0) {
    return {
      value,
      decision: 'base',
      dependencies: [],
      withoutOrder: null,
      withOrder: null,
      order: null,
    };
  }

  const order = orders[row - 1];
  const withoutOrder = dpTable[row - 1][capacity];

  if (order.weight > capacity) {
    return {
      value,
      decision: 'does-not-fit',
      dependencies: [{ row: row - 1, capacity }],
      withoutOrder,
      withOrder: null,
      order,
    };
  }

  const remainingCapacity = capacity - order.weight;
  const withOrder = order.profit + dpTable[row - 1][remainingCapacity];

  return {
    value,
    decision: withOrder > withoutOrder ? 'include' : 'exclude',
    dependencies: [
      { row: row - 1, capacity },
      { row: row - 1, capacity: remainingCapacity },
    ],
    withoutOrder,
    withOrder,
    order,
  };
}

/**
 * Unidades de avance de la visualización paso a paso.
 */
export const PLAYBACK_UNITS = Object.freeze({ CELL: 'cell', ROW: 'row' });

/**
 * Las celdas se calculan en orden de filas: DP[0][0..W], DP[1][0..W], ...
 * `filledCells` es cuántas celdas ya se calcularon; la última es la celda actual.
 */
export function getCurrentCell(filledCells, totalColumns) {
  if (filledCells <= 0) {
    return null;
  }

  const index = filledCells - 1;
  return { row: Math.floor(index / totalColumns), capacity: index % totalColumns };
}

export function isCellFilled(row, capacity, filledCells, totalColumns) {
  return row * totalColumns + capacity < filledCells;
}

/**
 * Siguiente valor de `filledCells`: una celda más, o hasta completar la fila actual
 * (o la siguiente si la actual ya está completa).
 */
export function getNextStep(filledCells, totalCells, totalColumns, unit) {
  const next =
    unit === PLAYBACK_UNITS.ROW
      ? (Math.floor(filledCells / totalColumns) + 1) * totalColumns
      : filledCells + 1;

  return Math.min(next, totalCells);
}
