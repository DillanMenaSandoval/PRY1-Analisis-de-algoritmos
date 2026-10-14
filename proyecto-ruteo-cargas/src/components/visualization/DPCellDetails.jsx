import { formatNumber } from '../../utils/formatters.js';

function DecisionText({ row, capacity, explanation }) {
  const { order, value, withoutOrder, withOrder, decision } = explanation;
  const cell = `DP[${row}][${capacity}]`;
  const previousCell = `DP[${row - 1}][${capacity}]`;

  if (decision === 'base') {
    return (
      <p>
        <strong>{cell} = 0</strong> — caso base: sin pedidos considerados la ganancia es 0.
      </p>
    );
  }

  if (decision === 'does-not-fit') {
    return (
      <p>
        <strong>{order.name}</strong> (peso {formatNumber(order.weight)}) no cabe en capacidad{' '}
        {formatNumber(capacity)}, así que se hereda {previousCell}:{' '}
        <strong>{cell} = {formatNumber(value)}</strong>.
      </p>
    );
  }

  const remainingCell = `DP[${row - 1}][${capacity - order.weight}]`;

  return (
    <>
      <p className="dp-details__formula">
        {cell} = max({previousCell}, {formatNumber(order.profit)} + {remainingCell}) = max(
        {formatNumber(withoutOrder)}, {formatNumber(withOrder)}) ={' '}
        <strong>{formatNumber(value)}</strong>
      </p>
      <p>
        {decision === 'include'
          ? `Conviene incluir «${order.name}»: aporta más que dejarlo fuera.`
          : `Conviene excluir «${order.name}»: incluirlo no mejora la ganancia (en empate se excluye).`}
      </p>
    </>
  );
}

function DPCellDetails({ selectedCell, explanation, onJumpToFinal, jumpDisabled = false }) {
  return (
    <div className="dp-details">
      <div className="dp-details__text" aria-live="polite">
        {selectedCell ? (
          <DecisionText
            row={selectedCell.row}
            capacity={selectedCell.capacity}
            explanation={explanation}
          />
        ) : (
          <p>Selecciona una celda para ver cómo se calculó su valor.</p>
        )}
      </div>
      <button
        type="button"
        className="button button--secondary button--small"
        onClick={onJumpToFinal}
        disabled={jumpDisabled}
      >
        Ir a la celda final DP[n][W]
      </button>
    </div>
  );
}

export default DPCellDetails;
