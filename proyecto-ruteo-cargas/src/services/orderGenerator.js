import { RANDOM_GENERATOR_DEFAULTS } from '../constants/config.js';

let idSequence = 0;

export function createOrderId() {
  idSequence += 1;
  const timestamp = Date.now().toString(36).toUpperCase();
  return `PED-${timestamp}-${idSequence.toString(36).toUpperCase()}`;
}

export function createOrder({ name, weight, profit, x, y }) {
  return { id: createOrderId(), name: name.trim(), weight, profit, x, y };
}

function randomInteger(min, max, random) {
  return Math.floor(random() * (max - min + 1)) + min;
}

export function suggestWeightRange(capacity) {
  return {
    minWeight: RANDOM_GENERATOR_DEFAULTS.minWeight,
    maxWeight: Math.max(RANDOM_GENERATOR_DEFAULTS.minWeight, Math.round(capacity / 2)),
  };
}

/**
 * Genera pedidos válidos con pesos y ganancias enteros positivos.
 * `random` es inyectable para obtener resultados reproducibles en pruebas.
 */
export function generateRandomOrders(count, options = {}) {
  const {
    minWeight,
    maxWeight,
    minProfit,
    maxProfit,
    coordinateRange,
    random = Math.random,
    startIndex = 1,
  } = { ...RANDOM_GENERATOR_DEFAULTS, ...options };

  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError('La cantidad de pedidos debe ser un entero mayor o igual a 0.');
  }

  if (minWeight < 1 || minWeight > maxWeight || minProfit < 1 || minProfit > maxProfit) {
    throw new RangeError('Los rangos de peso y ganancia deben ser positivos y estar ordenados.');
  }

  return Array.from({ length: count }, (_, offset) =>
    createOrder({
      name: `Pedido ${String(startIndex + offset).padStart(3, '0')}`,
      weight: randomInteger(minWeight, maxWeight, random),
      profit: randomInteger(minProfit, maxProfit, random),
      x: randomInteger(0, coordinateRange, random),
      y: randomInteger(0, coordinateRange, random),
    }),
  );
}
