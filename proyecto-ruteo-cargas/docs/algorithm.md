# Algoritmo: Mochila 0/1 con Programación Dinámica

Este documento describe el algoritmo implementado en
[`src/algorithms/dynamicProgramming/`](../src/algorithms/dynamicProgramming/) para seleccionar los
pedidos que se cargan en un vehículo.

## 1. Problema de Mochila 0/1

Se dispone de un vehículo con capacidad máxima **W** (entero) y de **n** pedidos. Cada pedido `i`
tiene:

| Campo    | Significado                                                        |
| -------- | ------------------------------------------------------------------ |
| `id`     | Identificador único                                                |
| `name`   | Nombre descriptivo                                                 |
| `weight` | Peso `wᵢ` (entero positivo)                                        |
| `profit` | Ganancia `pᵢ` (número positivo)                                    |
| `x`, `y` | Coordenadas de entrega (parte del modelo; no intervienen en el cálculo actual) |

Se busca un subconjunto `S` de pedidos que **maximice** la ganancia total sin exceder la
capacidad:

```text
maximizar   Σ pᵢ     (i ∈ S)
sujeto a    Σ wᵢ ≤ W (i ∈ S)
            cada pedido se toma completo o no se toma (0/1)
```

No se permite fraccionar pedidos ni tomar un pedido más de una vez. Por eso una estrategia voraz
(por ejemplo, ordenar por `pᵢ / wᵢ`) **no garantiza** el óptimo, y se requiere un método exacto.

## 2. Estado DP

```text
DP[i][w] = ganancia máxima alcanzable usando solo los primeros i pedidos
           con una capacidad disponible de w
```

con `0 ≤ i ≤ n` y `0 ≤ w ≤ W`. La respuesta del problema es `DP[n][W]`.

## 3. Caso base

```text
DP[0][w] = 0   para todo w      (sin pedidos no hay ganancia)
```

La columna `w = 0` también vale 0 en todas las filas, porque ningún pedido tiene peso 0.

## 4. Recurrencia

Para el pedido `i` (índice `i − 1` en el arreglo, porque la fila 0 es el caso base):

Si el pedido **no cabe** (`weight[i − 1] > w`):

```text
DP[i][w] = DP[i − 1][w]
```

Si el pedido **cabe**:

```text
DP[i][w] = max(
  DP[i − 1][w],                                   ← excluir el pedido
  profit[i − 1] + DP[i − 1][w − weight[i − 1]]    ← incluir el pedido
)
```

La recurrencia es correcta por **subestructura óptima**: en una solución óptima para `(i, w)`,
el pedido `i` está o no está. Si no está, lo que queda es una solución óptima para `(i − 1, w)`.
Si está, lo que queda es una solución óptima para `(i − 1, w − wᵢ)`. Los subproblemas
`(i − 1, ·)` se **solapan** entre distintas celdas, y la tabla evita recalcularlos.

## 5. Construcción de la tabla

Implementada en `buildDPTable(orders, capacity)` ([`knapsackDP.js`](../src/algorithms/dynamicProgramming/knapsackDP.js)):

1. Se crea la fila 0 con `W + 1` ceros.
2. Para cada pedido `i = 1..n` se crea una fila nueva y se recorre `w = 0..W` aplicando la
   recurrencia, que solo consulta la fila `i − 1`.
3. Cada celda calculada incrementa el contador `statesExplored`.

Cada fila es un `Float64Array`: memoria contigua, 8 bytes por estado y sin sobrecoste de objetos.
Así el consumo es predecible, lo que permite fijar límites seguros en la interfaz.

Ejemplo del enunciado (capacidad 7):

| i \ w                | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7     |
| -------------------- | - | - | - | - | - | - | - | ----- |
| 0 (sin pedidos)      | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0     |
| 1 (peso 1, gan. 1)   | 0 | 1 | 1 | 1 | 1 | 1 | 1 | 1     |
| 2 (peso 3, gan. 4)   | 0 | 1 | 1 | 4 | 5 | 5 | 5 | 5     |
| 3 (peso 4, gan. 5)   | 0 | 1 | 1 | 4 | 5 | 6 | 6 | 9     |
| 4 (peso 5, gan. 7)   | 0 | 1 | 1 | 4 | 5 | 7 | 8 | **9** |

## 6. Reconstrucción de los pedidos seleccionados

Implementada en `reconstructSolution(dpTable, orders, capacity)`
([`reconstructSolution.js`](../src/algorithms/dynamicProgramming/reconstructSolution.js)).

Se parte de `(i, w) = (n, W)` y se sube fila por fila:

```text
si DP[i][w] ≠ DP[i − 1][w]  → el pedido i fue incluido; w ← w − weight[i − 1]
si no                        → el pedido i fue excluido; w no cambia
i ← i − 1
```

En el ejemplo: `DP[4][7] = DP[3][7] = 9`, así que se excluye el pedido 4. Como
`DP[3][7] = 9 ≠ DP[2][7] = 5`, se incluye el pedido 3 y la capacidad queda en 3. Como
`DP[2][3] = 4 ≠ DP[1][3] = 1`, se incluye el pedido 2 y la capacidad queda en 0. Por último,
`DP[1][0] = DP[0][0]`, así que se excluye el pedido 1. Resultado: pedidos 2 y 3, peso 7 y
ganancia 9.

La función también devuelve `tracePath`, la lista de celdas visitadas con su decisión, que la
interfaz usa para resaltar el camino sobre la tabla.

### Determinismo y empates

`Math.max` devuelve el valor de "excluir" cuando ambas opciones empatan, y la reconstrucción solo
marca un pedido como incluido si su celda **difiere** de la de arriba. Por lo tanto, ante
soluciones con la misma ganancia, el algoritmo prefiere siempre excluir el pedido de mayor
índice. Para una misma entrada el resultado es siempre idéntico.

## 7. Métricas

`solveKnapsack(orders, capacity)` devuelve:

| Campo             | Descripción                                                            |
| ----------------- | ---------------------------------------------------------------------- |
| `maxProfit`       | `DP[n][W]`                                                             |
| `totalWeight`     | Suma de pesos de los pedidos seleccionados (siempre `≤ W`)            |
| `selectedOrders`  | Pedidos seleccionados, en el orden original                            |
| `dpTable`         | Tabla completa `(n + 1) × (W + 1)`                                     |
| `statesExplored`  | Estados DP calculados: exactamente `n · (W + 1)` (la fila base no se cuenta) |
| `executionTime`   | Milisegundos medidos con `performance.now()` (construcción + reconstrucción) |
| `capacity`        | `W`                                                                    |
| `ordersProcessed` | `n`                                                                    |
| `occupancy`       | `totalWeight / W · 100`                                                |
| `tracePath`       | Camino de reconstrucción                                               |

> Los navegadores reducen la resolución de `performance.now()` (típicamente a 0.1 ms, o más en
> algunos navegadores) como mitigación de ataques de temporización. En ejecuciones muy pequeñas
> el tiempo puede aparecer como `0.000 ms`. En esos casos, `statesExplored` es la medida
> fiable del trabajo realizado.

## 8. Razón para elegir Programación Dinámica

- El problema tiene **subestructura óptima** y **subproblemas solapados**, las dos condiciones
  para aplicar Programación Dinámica.
- Es **exacto**: a diferencia de las heurísticas voraces, garantiza la ganancia máxima.
- La cantidad de subproblemas distintos es solo `(n + 1)(W + 1)`, frente a los `2ⁿ`
  subconjuntos que examina la fuerza bruta.
- La tabla es didáctica: cada celda se puede explicar a partir de dos celdas de la fila
  anterior, y eso es justo lo que muestra la visualización.

## 9. Ventajas

- Solución óptima garantizada y determinista.
- Tiempo `O(n·W)`: práctico cuando `W` es moderado, aunque `n` sea grande (cientos de pedidos).
- Implementación iterativa, sin recursión, así que no hay riesgo de desbordar la pila.
- La tabla completa permite reconstruir la solución y visualizar el proceso.

## 10. Desventajas

- **Pseudopolinomial**: el costo crece con el valor numérico de `W`, no con su número de dígitos
  (ver [complexity.md](complexity.md)).
- Memoria `O(n·W)` al conservar la tabla completa.
- Exige pesos y capacidad **enteros**. Con pesos decimales hay que escalarlos (por ejemplo,
  multiplicar por 100), lo que multiplica `W` y el costo.
- No aprovecha la estructura de instancias fáciles: siempre llena la tabla completa.

## 11. Trade-offs

| Decisión                                   | Beneficio                                   | Costo                                        |
| ------------------------------------------ | ------------------------------------------- | -------------------------------------------- |
| Tabla completa `(n+1)×(W+1)`               | Reconstrucción directa y visualización      | Memoria `O(n·W)`                             |
| Filas `Float64Array`                       | Memoria compacta y predecible               | La tabla no es un arreglo JS convencional    |
| Límite de 5 000 000 estados en la interfaz | Evita agotar la memoria del navegador (~40 MB) | Rechaza instancias muy grandes            |
| Visualización paginada (20 × 26 celdas)    | La interfaz nunca se bloquea al renderizar  | Hay que navegar por bloques                  |
| Ejecución en el hilo principal             | Simplicidad, sin Web Workers                | Con el límite actual tarda decenas de ms; límites mayores requerirían un Worker |

Una alternativa de memoria `O(W)` (una sola fila reutilizada, recorriendo `w` de mayor a menor)
obtiene la ganancia máxima, pero **pierde la información necesaria para reconstruir** qué
pedidos se eligieron y no permite mostrar la tabla. Por eso no se usó en este proyecto.
