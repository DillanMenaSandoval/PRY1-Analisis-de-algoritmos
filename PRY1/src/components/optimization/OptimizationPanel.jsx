import Panel from '../common/Panel.jsx'
import Button from '../common/Button.jsx'
import EmptyState from '../common/EmptyState.jsx'
import { PENDING_BADGE, PENDING_FEATURE } from '../../constants/messages.js'
import './OptimizationPanel.css'

function OptimizationPanel() {
  return (
    <Panel
      title="Optimización de carga"
      description="Pedidos seleccionados según la capacidad del vehículo."
      badge={PENDING_BADGE}
    >
      <div className="optimization-panel__results">
        <EmptyState
          title="La optimización todavía no se ha ejecutado."
          message="Aquí se mostrarán los pedidos seleccionados."
        />
      </div>
      <div className="optimization-panel__actions">
        <Button disabled title={PENDING_FEATURE}>
          Ejecutar optimización
        </Button>
      </div>
    </Panel>
  )
}

export default OptimizationPanel
