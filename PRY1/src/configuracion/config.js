export const DEFAULT_CAPACITY = 50;

export const INPUT_LIMITS = Object.freeze({
  maxCapacity: 100_000,
  maxOrders: 500,
  maxWeight: 100_000,
  maxProfit: 1_000_000_000,
  maxNameLength: 60,
  maxAbsoluteCoordinate: 1_000_000,
  // n · (W + 1) celdas en memoria; por encima de este límite se rechaza la ejecución
  // para no agotar la memoria del navegador.
  maxDPStates: 5_000_000,
});

export const RANDOM_GENERATOR_DEFAULTS = Object.freeze({
  count: 8,
  minCount: 1,
  maxCount: 100,
  minWeight: 1,
  maxWeight: 25,
  minProfit: 5,
  maxProfit: 120,
  coordinateRange: 100,
});

export const DP_TABLE_VIEW = Object.freeze({
  rowsPerPage: 20,
  columnsPerPage: 26,
  largeTableWarningStates: 10_000,
});

export const EXAMPLE_CASE = Object.freeze({
  capacity: 7,
  orders: Object.freeze([
    { id: 'EJ-1', name: 'Paquete pequeño', weight: 1, profit: 1, x: 12, y: 40 },
    { id: 'EJ-2', name: 'Caja mediana', weight: 3, profit: 4, x: 35, y: 18 },
    { id: 'EJ-3', name: 'Electrodoméstico', weight: 4, profit: 5, x: 70, y: 55 },
    { id: 'EJ-4', name: 'Mobiliario', weight: 5, profit: 7, x: 88, y: 12 },
  ]),
});
