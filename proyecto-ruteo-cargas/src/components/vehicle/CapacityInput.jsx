import FormField from '../common/FormField.jsx';
import { INPUT_LIMITS } from '../../constants/config.js';
import { formatNumber } from '../../utils/formatters.js';

function CapacityInput({ value, error, onChange }) {
  return (
    <FormField
      id="vehicle-capacity"
      label="Capacidad máxima del vehículo (W)"
      type="number"
      inputMode="numeric"
      min="1"
      max={INPUT_LIMITS.maxCapacity}
      step="1"
      value={value}
      error={error}
      hint={`Entero de 1 a ${formatNumber(INPUT_LIMITS.maxCapacity)} unidades de peso.`}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export default CapacityInput;
