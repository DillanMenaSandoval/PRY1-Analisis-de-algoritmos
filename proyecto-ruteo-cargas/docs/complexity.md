# Análisis de complejidad

Notación:

```text
n = cantidad de pedidos
W = capacidad del vehículo (entero)
```

## 1. Tiempo: O(n·W)

| Fase                                  | Operaciones                          | Costo      |
| ------------------------------------- | ------------------------------------ | ---------- |
| Inicializar la fila base              | `W + 1` celdas                       | `Θ(W)`     |
| Llenar la tabla                       | `n · (W + 1)` celdas, cada una `O(1)` | `Θ(n·W)`  |
| Reconstruir la solución               | una decisión por fila                | `Θ(n)`     |
| Sumar pesos de los seleccionados      | como máximo `n` pedidos              | `O(n)`     |

Cada celda hace una comparación, como mucho una suma y una lectura de la fila anterior, así que su
costo es constante. El total es:

```text
T(n, W) = Θ(n·W + n + W) = Θ(n·W)      (para n ≥ 1)
```

El contador `statesExplored` vale exactamente `n · (W + 1)` en toda ejecución. Coincide con el
término dominante y sirve como medida del trabajo, independiente del reloj.

## 2. Memoria: O(n·W)

La implementación **conserva la tabla completa**, porque la reconstrucción y la visualización la
necesitan:

```text
M(n, W) = (n + 1) · (W + 1) · 8 bytes   (Float64Array)  =  Θ(n·W)
```

A esto se suman `O(n)` para la lista de seleccionados y el camino de reconstrucción. No se aplica
ninguna reducción asintótica de memoria: la tabla se construye completa.

Ejemplos: `n = 100, W = 10 000` ocupa unos 7.7 MB, y el límite de la interfaz (5 000 000 estados)
ronda los 40 MB.

## 3. ¿Por qué es pseudopolinomial?

Un algoritmo es **polinomial** si su tiempo está acotado por un polinomio en el **tamaño de la
entrada**, es decir, en la cantidad de bits necesarios para escribirla.

El número `W` se escribe con solo `b = ⌈log₂(W + 1)⌉` bits, pero el algoritmo hace trabajo
proporcional al **valor** de `W`:

```text
W ≈ 2^b   ⟹   T = Θ(n · 2^b)
```

Si se agrega un solo dígito binario a la capacidad, el tiempo se **duplica**, y con un dígito
decimal se multiplica por 10. El tiempo es polinomial en el valor numérico de `W`, pero
exponencial en su longitud. Esa es la definición de complejidad **pseudopolinomial**.

Esto es coherente con la teoría: la versión de decisión de la Mochila 0/1 es **NP-completa**. No
se conoce un algoritmo polinomial en el tamaño de la entrada, y la Programación Dinámica no lo es.
Sí es eficiente cuando `W` es pequeño o moderado, que es el caso habitual en la planificación
de cargas con unidades de peso razonables.

## 4. Mejor caso, peor caso y caso esperado

La implementación **no tiene salidas tempranas**: siempre calcula las `n · (W + 1)` celdas y
siempre hace `n` pasos de reconstrucción. El valor de los pesos y ganancias no cambia la cantidad
de operaciones.

| Caso          | Tiempo   | Explicación                                                              |
| ------------- | -------- | ------------------------------------------------------------------------ |
| Mejor caso    | `Θ(n·W)` | Incluso si ningún pedido cabe, o si caben todos, se llena la tabla completa |
| Peor caso     | `Θ(n·W)` | Mismo número de celdas; cada una tiene costo constante                   |
| Caso esperado | `Θ(n·W)` | El costo depende solo de `n` y `W`, no de la distribución de los datos   |

Los casos triviales `n = 0` (solo se crea la fila base, `Θ(W)`) y `W` pequeño son "mejores" solo
porque reducen `n` o `W`, no por la forma de los datos. La memoria es `Θ(n·W)` en todos los casos.

### Comportamiento observado

Mediciones con Node.js 21 (mediana de 5 ejecuciones, pedidos aleatorios):

| n   | W      | Estados `n·(W+1)` | Tiempo (ms) | Memoria tabla |
| --- | ------ | ----------------- | ----------- | ------------- |
| 100 | 1 000  | 100 100           | 0.54        | 0.8 MB        |
| 100 | 5 000  | 500 100           | 2.24        | 3.8 MB        |
| 100 | 10 000 | 1 000 100         | 3.79        | 7.6 MB        |
| 100 | 20 000 | 2 000 100         | 6.87        | 15.3 MB       |
| 100 | 40 000 | 4 000 100         | 12.94       | 30.5 MB       |
| 50  | 10 000 | 500 050           | 1.70        | 3.8 MB        |
| 200 | 10 000 | 2 000 200         | 7.92        | 15.3 MB       |
| 400 | 10 000 | 4 000 400         | 18.08       | 30.5 MB       |

Si `n` está fijo, el tiempo crece linealmente con `W`, y si `W` está fijo, crece linealmente con
`n`: aproximadamente 3–4 ms por millón de estados, lo que confirma el `Θ(n·W)`. Los valores
absolutos dependen de la máquina y del navegador.

## 5. Trade-off entre exactitud y consumo de memoria

| Enfoque                                  | Exacto | Tiempo       | Memoria    | Reconstruye la selección |
| ---------------------------------------- | ------ | ------------ | ---------- | ------------------------ |
| **DP con tabla completa (implementado)** | Sí     | `Θ(n·W)`     | `Θ(n·W)`   | Sí, en `O(n)`            |
| DP con una sola fila                     | Sí     | `Θ(n·W)`     | `Θ(W)`     | No                       |
| DP + matriz de bits de decisión          | Sí     | `Θ(n·W)`     | `Θ(W)` + `n·W` bits | Sí             |
| Voraz por `pᵢ / wᵢ`                      | No     | `O(n log n)` | `O(n)`     | Sí (pero no óptima)      |
| FPTAS (escalado de ganancias)            | Aprox. `(1 − ε)` | `O(n³/ε)` | `O(n²/ε)` | Sí             |

Este proyecto prioriza **exactitud, reconstrucción y visualización**, así que acepta la memoria
`Θ(n·W)` y la limita con un tope explícito de estados.

## 6. Programación Dinámica frente a fuerza bruta

La fuerza bruta evalúa los `2ⁿ` subconjuntos, y cada evaluación cuesta `O(n)`:

```text
T_fuerza_bruta = Θ(n · 2ⁿ)        M = O(n)
T_DP           = Θ(n · W)         M = Θ(n · W)
```

| n  | Subconjuntos `2ⁿ`         | Estados DP con W = 1 000 |
| -- | ------------------------- | ------------------------ |
| 10 | 1 024                     | 10 010                   |
| 20 | 1 048 576                 | 20 020                   |
| 30 | ≈ 1.07 × 10⁹              | 30 030                   |
| 50 | ≈ 1.13 × 10¹⁵             | 50 050                   |
| 100| ≈ 1.27 × 10³⁰             | 100 100                  |

La DP evita recalcular subproblemas: dos subconjuntos distintos que dejan la misma capacidad
restante tras considerar los mismos pedidos comparten la celda `DP[i][w]`. La fuerza bruta solo
compite cuando `n` es muy pequeño y `W` es enorme. De hecho, las pruebas usan la fuerza bruta
como **oráculo** para validar la DP en 200 casos aleatorios con `n ≤ 10`.

## 7. Limitaciones cuando W es muy grande

- **Tiempo y memoria proporcionales a W.** Con `W = 10⁹`, una sola fila ocuparía 8 GB, así que es
  inviable aunque `n` sea pequeño.
- **Escalado de unidades.** Expresar los pesos en gramos en lugar de kilogramos multiplica `W` por
  1 000, y con él el tiempo y la memoria.
- **Límites de la aplicación.** Para no bloquear ni agotar el navegador, la interfaz exige
  `W ≤ 100 000`, `n ≤ 500` y `n · (W + 1) ≤ 5 000 000` estados. Por encima de ese valor rechaza
  la ejecución con un mensaje explicativo.
- **Visualización.** Una tabla de millones de celdas no se puede dibujar completa, así que se
  muestra por bloques de 20 filas × 26 columnas con navegación y un salto directo a `DP[n][W]`.

Alternativas para `W` grande (no implementadas): DP indexada por ganancia (`O(n · Σpᵢ)`, útil si
las ganancias son pequeñas), *meet-in-the-middle* (`O(2^{n/2}·n)`, útil si `n ≤ 40`),
ramificación y acotamiento, o el esquema aproximado FPTAS.
