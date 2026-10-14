import { useRef, useState } from 'react';
import FormField from '../common/FormField.jsx';
import { INPUT_LIMITS } from '../../constants/config.js';
import { validateOrderInput } from '../../utils/validation.js';
import './orders.css';

const EMPTY_FORM = { name: '', weight: '', profit: '', x: '0', y: '0' };

function OrderForm({ onAddOrder, disabled }) {
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const nameInputRef = useRef(null);

  const updateField = (field) => (event) => {
    setFormValues((currentValues) => ({ ...currentValues, [field]: event.target.value }));
    setErrors(({ [field]: _removed, ...remainingErrors }) => remainingErrors);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { order, errors: validationErrors } = validateOrderInput(formValues);

    if (!order) {
      setErrors(validationErrors);
      return;
    }

    onAddOrder(order);
    setFormValues(EMPTY_FORM);
    setErrors({});
    nameInputRef.current?.focus();
  };

  return (
    <form className="order-form" onSubmit={handleSubmit} noValidate>
      <FormField
        id="order-name"
        label="Nombre"
        className="order-form__name"
        ref={nameInputRef}
        value={formValues.name}
        error={errors.name}
        placeholder="Ej. Refrigerador"
        maxLength={INPUT_LIMITS.maxNameLength}
        onChange={updateField('name')}
      />
      <FormField
        id="order-weight"
        label="Peso"
        type="number"
        inputMode="numeric"
        min="1"
        step="1"
        value={formValues.weight}
        error={errors.weight}
        onChange={updateField('weight')}
      />
      <FormField
        id="order-profit"
        label="Ganancia"
        type="number"
        inputMode="decimal"
        min="0"
        step="any"
        value={formValues.profit}
        error={errors.profit}
        onChange={updateField('profit')}
      />
      <FormField
        id="order-x"
        label="Coord. X"
        type="number"
        inputMode="decimal"
        step="any"
        value={formValues.x}
        error={errors.x}
        onChange={updateField('x')}
      />
      <FormField
        id="order-y"
        label="Coord. Y"
        type="number"
        inputMode="decimal"
        step="any"
        value={formValues.y}
        error={errors.y}
        onChange={updateField('y')}
      />
      <button type="submit" className="button button--primary order-form__submit" disabled={disabled}>
        Agregar pedido
      </button>
      {disabled && (
        <p className="field__error order-form__limit">
          Se alcanzó el máximo de pedidos permitidos.
        </p>
      )}
    </form>
  );
}

export default OrderForm;
