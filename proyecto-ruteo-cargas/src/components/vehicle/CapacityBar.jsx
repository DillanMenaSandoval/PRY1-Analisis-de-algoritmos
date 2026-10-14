import { formatNumber, formatPercent } from '../../utils/formatters.js';
import './vehicle.css';

function CapacityBar({ usedWeight, capacity, occupancy }) {
  const fillWidth = Math.min(occupancy, 100);

  return (
    <div className="capacity-bar">
      <div className="capacity-bar__labels">
        <span id="capacity-bar-label">Ocupación del vehículo</span>
        <span className="capacity-bar__value">
          {formatNumber(usedWeight)} / {formatNumber(capacity)} · {formatPercent(occupancy)}
        </span>
      </div>
      <div
        className="capacity-bar__track"
        role="progressbar"
        aria-labelledby="capacity-bar-label"
        aria-valuemin={0}
        aria-valuemax={capacity}
        aria-valuenow={usedWeight}
      >
        <div className="capacity-bar__fill" style={{ width: `${fillWidth}%` }} />
      </div>
    </div>
  );
}

export default CapacityBar;
