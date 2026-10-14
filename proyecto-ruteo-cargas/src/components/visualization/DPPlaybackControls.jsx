import { PLAYBACK } from '../../constants/config.js';
import { PLAYBACK_UNITS } from './dpTableModel.js';
import { formatNumber } from '../../utils/formatters.js';

/**
 * Controles de la visualización paso a paso: iniciar, reproducir/pausar, avanzar,
 * ir al final, reiniciar y volver a la tabla completa.
 */
function DPPlaybackControls({
  isActive,
  isPlaying,
  isFinished,
  filledCells,
  totalCells,
  currentCell,
  lastOrderRow,
  unit,
  speedId,
  onStart,
  onTogglePlay,
  onAdvance,
  onFinish,
  onRestart,
  onShowAll,
  onUnitChange,
  onSpeedChange,
}) {
  return (
    <div className="dp-playback" role="group" aria-label="Controles de la visualización paso a paso">
      <div className="dp-playback__buttons">
        {isActive ? (
          <>
            <button
              type="button"
              className="button button--primary button--small"
              onClick={onTogglePlay}
              disabled={isFinished}
            >
              {isPlaying ? '⏸ Pausar' : '▶ Reproducir'}
            </button>
            <button
              type="button"
              className="button button--secondary button--small"
              onClick={onAdvance}
              disabled={isFinished || isPlaying}
            >
              Avanzar ›
            </button>
            <button
              type="button"
              className="button button--secondary button--small"
              onClick={onFinish}
              disabled={isFinished}
            >
              Ir al final ⏭
            </button>
            <button type="button" className="button button--secondary button--small" onClick={onRestart}>
              ↺ Reiniciar
            </button>
            <button type="button" className="button button--secondary button--small" onClick={onShowAll}>
              Ver tabla completa
            </button>
          </>
        ) : (
          <button type="button" className="button button--primary button--small" onClick={onStart}>
            ▶ Iniciar paso a paso
          </button>
        )}
      </div>

      <div className="dp-playback__options">
        <label className="dp-playback__option">
          Avance por
          <select
            className="field__input dp-playback__select"
            value={unit}
            onChange={(event) => onUnitChange(event.target.value)}
          >
            <option value={PLAYBACK_UNITS.CELL}>celda</option>
            <option value={PLAYBACK_UNITS.ROW}>fila (un pedido)</option>
          </select>
        </label>
        <label className="dp-playback__option">
          Velocidad
          <select
            className="field__input dp-playback__select"
            value={speedId}
            onChange={(event) => onSpeedChange(event.target.value)}
          >
            {PLAYBACK.speeds.map((speed) => (
              <option key={speed.id} value={speed.id}>
                {speed.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isActive && (
        <div className="dp-playback__status" role="status" aria-live="polite">
          <progress
            className="dp-playback__progress"
            max={totalCells}
            value={filledCells}
            aria-label="Progreso del cálculo de la tabla"
          />
          <p>
            {isFinished
              ? 'Tabla completa: se resaltan los pedidos incluidos y excluidos en la reconstrucción.'
              : `Celdas calculadas: ${formatNumber(filledCells)} de ${formatNumber(totalCells)}${
                  currentCell
                    ? ` · fila ${currentCell.row} de ${lastOrderRow} · capacidad ${currentCell.capacity}`
                    : ' · pulsa Reproducir o Avanzar para empezar'
                }`}
          </p>
        </div>
      )}
    </div>
  );
}

export default DPPlaybackControls;
