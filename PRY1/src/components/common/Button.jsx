import './Button.css'

function Button({ children, variant = 'primary', type = 'button', disabled = false, title, ...rest }) {
  return (
    <button
      type={type}
      className={`button button--${variant}`}
      disabled={disabled}
      title={title}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
