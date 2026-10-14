import { formatNumber } from '../../utils/formatters.js';

function DPTablePager({ label, range, total, pageIndex, pageCount, onPageChange }) {
  return (
    <div className="dp-pager">
      <span className="dp-pager__label">
        {label}: {formatNumber(range.start)}–{formatNumber(range.end - 1)} de{' '}
        {formatNumber(total - 1)}
      </span>
      <div className="dp-pager__buttons">
        <button
          type="button"
          className="button button--secondary button--small"
          disabled={pageIndex === 0}
          aria-label={`${label}: bloque anterior`}
          onClick={() => onPageChange(pageIndex - 1)}
        >
          ‹ Anterior
        </button>
        <button
          type="button"
          className="button button--secondary button--small"
          disabled={pageIndex >= pageCount - 1}
          aria-label={`${label}: bloque siguiente`}
          onClick={() => onPageChange(pageIndex + 1)}
        >
          Siguiente ›
        </button>
      </div>
    </div>
  );
}

export default DPTablePager;
