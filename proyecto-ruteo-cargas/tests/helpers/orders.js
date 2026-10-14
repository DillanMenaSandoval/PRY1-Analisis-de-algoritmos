export function makeOrders(pairs) {
  return pairs.map(([weight, profit], index) => ({
    id: `T-${index + 1}`,
    name: `Pedido ${index + 1}`,
    weight,
    profit,
    x: index,
    y: index,
  }));
}

export function sumBy(orders, key) {
  return orders.reduce((total, order) => total + order[key], 0);
}

/** Oráculo exponencial O(2^n) para contrastar la DP en entradas pequeñas. */
export function bruteForceMaxProfit(orders, capacity) {
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

    if (weight <= capacity && profit > best) {
      best = profit;
    }
  }

  return best;
}

/** Generador pseudoaleatorio con semilla (mulberry32) para pruebas reproducibles. */
export function createSeededRandom(seed) {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
