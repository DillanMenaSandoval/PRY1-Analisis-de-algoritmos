/**
 * Recorre la tabla desde DP[n][W] hacia DP[0][·] para recuperar los pedidos elegidos.
 *
 * Un pedido i se tomó si y solo si DP[i][w] !== DP[i-1][w]. Como la tabla se construye
 * con Math.max, en caso de empate el valor se hereda de la fila anterior; por eso la
 * reconstrucción es determinista y, ante soluciones de igual ganancia, prefiere no
 * incluir el pedido de mayor índice.
 *
 * @returns {{ selectedOrders: object[], tracePath: { row: number, capacity: number, taken: boolean }[] }}
 */
export function reconstructSolution(dpTable, orders, capacity) {
  const selectedOrders = [];
  const tracePath = [];
  let remainingCapacity = capacity;

  for (let row = orders.length; row > 0; row -= 1) {
    const order = orders[row - 1];
    const taken = dpTable[row][remainingCapacity] !== dpTable[row - 1][remainingCapacity];

    tracePath.push({ row, capacity: remainingCapacity, taken });

    if (taken) {
      selectedOrders.push(order);
      remainingCapacity -= order.weight;
    }
  }

  return { selectedOrders: selectedOrders.reverse(), tracePath };
}
