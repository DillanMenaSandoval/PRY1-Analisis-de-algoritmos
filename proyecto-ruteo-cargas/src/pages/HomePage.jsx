import { useEffect, useRef } from 'react';
import MainLayout from '../components/layout/MainLayout.jsx';
import CapacityInput from '../components/vehicle/CapacityInput.jsx';
import RandomOrderGenerator from '../components/orders/RandomOrderGenerator.jsx';
import OrderForm from '../components/orders/OrderForm.jsx';
import OrderList from '../components/orders/OrderList.jsx';
import ExecutionControls from '../components/controls/ExecutionControls.jsx';
import ResultPanel from '../components/results/ResultPanel.jsx';
import DPTable from '../components/visualization/DPTable.jsx';
import { useKnapsack } from '../hooks/useKnapsack.js';
import './HomePage.css';

function HomePage() {
  const knapsack = useKnapsack();
  const resultsRef = useRef(null);

  useEffect(() => {
    if (knapsack.runCount > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [knapsack.runCount]);

  return (
    <MainLayout>
      <div className="home-grid">
        <section className="panel home-grid__config" aria-labelledby="config-title">
          <div className="panel__header">
            <h2 id="config-title" className="panel__title">Configuración</h2>
          </div>

          <div className="panel__section">
            <h3 className="panel__section-title">Capacidad</h3>
            <CapacityInput
              value={knapsack.capacityInput}
              error={knapsack.capacityError}
              onChange={knapsack.updateCapacity}
            />
          </div>

          <div className="panel__section">
            <h3 className="panel__section-title">Generador aleatorio</h3>
            <RandomOrderGenerator
              onGenerate={knapsack.generateOrders}
              onLoadExample={knapsack.loadExample}
            />
          </div>

          <div className="panel__section">
            <h3 className="panel__section-title">Agregar pedido</h3>
            <OrderForm onAddOrder={knapsack.addOrder} disabled={!knapsack.canAddOrders} />
          </div>
        </section>

        <section className="panel home-grid__orders" aria-labelledby="orders-title">
          <div className="panel__header">
            <h2 id="orders-title" className="panel__title">Pedidos disponibles</h2>
            <p className="panel__subtitle">Los pedidos elegidos se resaltan tras ejecutar.</p>
          </div>
          <OrderList
            orders={knapsack.orders}
            selectedOrderIds={knapsack.selectedOrderIds}
            onRemoveOrder={knapsack.removeOrder}
          />
        </section>

        <section className="panel home-grid__controls" aria-label="Controles de ejecución">
          <ExecutionControls
            canRun={knapsack.canRun}
            orderCount={knapsack.orders.length}
            capacity={knapsack.capacity}
            warnings={knapsack.executionWarnings}
            error={knapsack.executionError}
            onRun={knapsack.runAlgorithm}
            onReset={knapsack.resetAll}
          />
        </section>

        <section
          ref={resultsRef}
          className="panel home-grid__results"
          aria-labelledby="results-title"
        >
          <div className="panel__header">
            <h2 id="results-title" className="panel__title">Resultado</h2>
          </div>
          <ResultPanel result={knapsack.result} orders={knapsack.orders} />
        </section>

        <section className="panel home-grid__dp" aria-labelledby="dp-title">
          <div className="panel__header">
            <h2 id="dp-title" className="panel__title">Visualización DP</h2>
            <p className="panel__subtitle">
              Filas = pedidos considerados · Columnas = capacidad · Celda = ganancia óptima
            </p>
          </div>
          {knapsack.result ? (
            <DPTable key={knapsack.runCount} orders={knapsack.orders} result={knapsack.result} />
          ) : (
            <p className="empty-state">La tabla de estados aparecerá al ejecutar el algoritmo.</p>
          )}
        </section>
      </div>
    </MainLayout>
  );
}

export default HomePage;
