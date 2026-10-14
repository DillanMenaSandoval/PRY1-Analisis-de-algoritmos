import {
  formatMilliseconds,
  formatNumber,
  formatPercent,
} from '../../utils/formatters.js';
import './statistics.css';

function buildStatistics(result) {
  return [
    { label: 'Ganancia máxima', value: formatNumber(result.maxProfit), highlight: true },
    { label: 'Pedidos procesados', value: formatNumber(result.ordersProcessed) },
    { label: 'Pedidos seleccionados', value: formatNumber(result.selectedOrders.length) },
    { label: 'Peso seleccionado', value: formatNumber(result.totalWeight) },
    { label: 'Capacidad total', value: formatNumber(result.capacity) },
    { label: 'Ocupación', value: formatPercent(result.occupancy) },
    { label: 'Tiempo de ejecución', value: formatMilliseconds(result.executionTime) },
    { label: 'Estados explorados', value: formatNumber(result.statesExplored) },
  ];
}

function StatisticsPanel({ result }) {
  return (
    <>
      <dl className="statistics-grid">
        {buildStatistics(result).map(({ label, value, highlight }) => (
          <div key={label} className={`stat-tile${highlight ? ' stat-tile--highlight' : ''}`}>
            <dt className="stat-tile__label">{label}</dt>
            <dd className="stat-tile__value">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="statistics-note">
        El tiempo se mide con performance.now(). Los navegadores limitan su resolución
        (≈0.1 ms o más), por lo que ejecuciones muy pequeñas pueden mostrar 0.000 ms.
      </p>
    </>
  );
}

export default StatisticsPanel;
