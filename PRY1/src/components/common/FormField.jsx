import { useId } from 'react'
import './FormField.css'

function FormField({ label, unit, type = 'text', ...inputProps }) {
  const id = useId()

  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={id}>
        {label}
        {unit && <span className="form-field__unit">({unit})</span>}
      </label>
      <input id={id} type={type} className="form-field__input" {...inputProps} />
    </div>
  )
}

export default FormField
