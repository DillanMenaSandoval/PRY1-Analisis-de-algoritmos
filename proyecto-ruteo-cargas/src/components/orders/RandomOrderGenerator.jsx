import { useState } from 'react';
import FormField from '../common/FormField.jsx';
import { RANDOM_GENERATOR_DEFAULTS } from '../../constants/config.js';
import { validateRandomCount } from '../../utils/validation.js';
import './orders.css';

function RandomOrderGenerator({ onGenerate, onLoadExample }) {
  const [countInput, setCountInput] = useState(String(RANDOM_GENERATOR_DEFAULTS.count));
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const { value, error: validationError } = validateRandomCount(countInput, RANDOM_GENERATOR_DEFAULTS);
    setError(validationError);

    if (!validationError) {
      onGenerate(value);
    }
  };

  return (
    <form className="random-generator" onSubmit={handleSubmit} noValidate>
      <FormField
        id="random-count"
        label="Cantidad de pedidos"
        type="number"
        inputMode="numeric"
        min={RANDOM_GENERATOR_DEFAULTS.minCount}
        max={RANDOM_GENERATOR_DEFAULTS.maxCount}
        step="1"
        value={countInput}
        error={error}
        hint="Reemplaza la lista actual. Los pesos se ajustan a la capacidad."
        onChange={(event) => {
          setCountInput(event.target.value);
          setError(null);
        }}
      />
      <div className="random-generator__actions">
        <button type="submit" className="button button--secondary">
          Generar aleatorios
        </button>
        <button type="button" className="button button--secondary" onClick={onLoadExample}>
          Cargar ejemplo
        </button>
      </div>
    </form>
  );
}

export default RandomOrderGenerator;
