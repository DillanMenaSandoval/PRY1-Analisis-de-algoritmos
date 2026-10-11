import Header from './components/layout/Header.jsx'
import CapacityPanel from './components/config/CapacityPanel.jsx'
import OrderForm from './components/orders/OrderForm.jsx'
import OrdersTable from './components/orders/OrdersTable.jsx'
import OptimizationPanel from './components/optimization/OptimizationPanel.jsx'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="app__main">
        <aside className="app__sidebar">
          <CapacityPanel />
          <OrderForm />
        </aside>
        <div className="app__content">
          <OrdersTable />
          <OptimizationPanel />
        </div>
      </main>
    </div>
  )
}

export default App
