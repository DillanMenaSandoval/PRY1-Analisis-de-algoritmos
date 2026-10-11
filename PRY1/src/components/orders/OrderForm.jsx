import Panel from '../common/Panel.jsx'
import FormField from '../common/FormField.jsx'
import Button from '../common/Button.jsx'
import { PENDING_BADGE, PENDING_FEATURE } from '../../constants/messages.js'
import './OrderForm.css'

function OrderForm() {
  return (
    <Panel
      title="Registro de pedidos"
      description="Ingresa los datos de un pedido de entrega."
      badge={PENDING_BADGE}
    >
      <FormField label="Nombre del pedido" placeholder="Ej. Pedido Centro" />
      <div className="order-form__grid">
        <FormField label="Peso" unit="kg" type="number" min="1" placeholder="0" />
        <FormField label="Ganancia" unit="$" type="number" min="0" placeholder="0" />
      </div>
      <div className="order-form__grid">
        <FormField label="Coordenada X" type="number" placeholder="0" />
        <FormField label="Coordenada Y" type="number" placeholder="0" />
      </div>
      <div className="order-form__actions">
        <Button disabled title={PENDING_FEATURE}>
          Agregar pedido
        </Button>
        <Button variant="secondary" disabled title={PENDING_FEATURE}>
          Generar pedidos aleatorios
        </Button>
      </div>
    </Panel>
  )
}

export default OrderForm
