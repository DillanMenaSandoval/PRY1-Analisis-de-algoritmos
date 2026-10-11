import Panel from '../common/Panel.jsx'
import FormField from '../common/FormField.jsx'
import Button from '../common/Button.jsx'
import { PENDING_BADGE, PENDING_FEATURE } from '../../constants/messages.js'

function CapacityPanel() {
  return (
    <Panel
      title="Configuración del vehículo"
      description="Define la capacidad máxima de carga."
      badge={PENDING_BADGE}
    >
      <FormField label="Capacidad máxima" unit="kg" type="number" min="1" placeholder="Ej. 50" />
      <Button disabled title={PENDING_FEATURE}>
        Configurar capacidad
      </Button>
    </Panel>
  )
}

export default CapacityPanel
