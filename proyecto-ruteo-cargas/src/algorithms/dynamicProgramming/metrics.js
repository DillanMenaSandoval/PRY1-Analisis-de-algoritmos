export function measureExecutionTime(task) {
  const startTime = performance.now();
  const value = task();
  return { value, executionTime: performance.now() - startTime };
}

export function calculateTotalWeight(orders) {
  return orders.reduce((total, order) => total + order.weight, 0);
}

export function calculateTotalProfit(orders) {
  return orders.reduce((total, order) => total + order.profit, 0);
}

export function calculateOccupancy(usedWeight, capacity) {
  return capacity > 0 ? (usedWeight / capacity) * 100 : 0;
}

export function countDPStates(orderCount, capacity) {
  return orderCount * (capacity + 1);
}
