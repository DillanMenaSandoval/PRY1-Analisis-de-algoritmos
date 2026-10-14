import { memo } from 'react';
import { formatNumber } from '../../utils/formatters.js';

const TRACE_CLASS = {
  true: 'dp-cell--taken',
  false: 'dp-cell--skipped',
};

function DPCell({
  row,
  capacity,
  value,
  traceStatus,
  isPending,
  isDependency,
  isSelected,
  isFinal,
  onSelect,
}) {
  const classNames = [
    'dp-cell',
    TRACE_CLASS[traceStatus],
    isPending && 'dp-cell--pending',
    isDependency && 'dp-cell--dependency',
    isSelected && 'dp-cell--selected',
    isFinal && 'dp-cell--final',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <td className={classNames}>
      <button
        type="button"
        className="dp-cell__button"
        aria-pressed={isSelected}
        aria-label={
          isPending
            ? `DP[${row}][${capacity}] pendiente de calcular`
            : `DP[${row}][${capacity}] = ${formatNumber(value)}`
        }
        disabled={isPending}
        onClick={() => onSelect(row, capacity)}
      >
        {isPending ? '·' : formatNumber(value)}
      </button>
    </td>
  );
}

export default memo(DPCell);
