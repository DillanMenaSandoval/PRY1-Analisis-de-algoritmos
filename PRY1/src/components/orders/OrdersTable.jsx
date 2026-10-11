import Panel from '../common/Panel.jsx'
import EmptyState from '../common/EmptyState.jsx'
import './OrdersTable.css'

const COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre' },
  { key: 'weight', label: 'Peso (kg)', numeric: true },
  { key: 'profit', label: 'Ganancia ($)', numeric: true },
  { key: 'x', label: 'Coordenada X', numeric: true },
  { key: 'y', label: 'Coordenada Y', numeric: true },
]

function OrdersTable({ orders = [] }) {
  return (
    <Panel
      title="Pedidos registrados"
      description="Listado de pedidos disponibles para la planificación."
      badge={`${orders.length} pedidos`}
    >
      <div className="orders-table__wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              {COLUMNS.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={column.numeric ? 'orders-table__cell--numeric' : undefined}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                {COLUMNS.map((column) => (
                  <td
                    key={column.key}
                    className={column.numeric ? 'orders-table__cell--numeric' : undefined}
                  >
                    {order[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && (
        <EmptyState
          title="No hay pedidos registrados."
          message="Los pedidos agregados aparecerán en esta tabla."
        />
      )}
    </Panel>
  )
}

export default OrdersTable
