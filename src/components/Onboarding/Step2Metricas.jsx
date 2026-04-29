'use client';
import { useState } from 'react';
import styles from './StepShared.module.css';

export default function Step2Metricas({ datos, onAvanzar, onRetroceder }) {
  const [peso, setPeso] = useState(datos.pesoActual || '');
  const [talla, setTalla] = useState(datos.talla || '');
  const [unidadPeso, setUnidadPeso] = useState(datos.unidadPeso || 'lbs');
  const [unidadTalla, setUnidadTalla] = useState(datos.unidadTalla || 'in');
  const [error, setError] = useState('');

  const handleContinuar = () => {
    if (!peso || isNaN(Number(peso)) || Number(peso) <= 0) { setError('Ingresa un peso válido'); return; }
    if (!talla || isNaN(Number(talla)) || Number(talla) <= 0) { setError('Ingresa una talla válida'); return; }
    setError('');
    onAvanzar({ pesoActual: Number(peso), talla: Number(talla), unidadPeso, unidadTalla });
  };

  return (
    <div className={styles.stepWrap}>
      <div className={styles.heroSection}>
        <div className={styles.emoji}>⚖️</div>
        <h1 className="text-display gradient-text">Tu punto<br />de partida</h1>
        <p className="text-body mt-sm">No te juzgamos, estos datos nos ayudan a calcular tu punto de inicio.</p>
      </div>

      <div className={styles.form}>
        {/* Peso */}
        <div className="input-wrapper">
          <label className="input-label">Tu peso actual</label>
          <div className={styles.inputRow}>
            <input
              id="peso-actual"
              className="input-field"
              type="number"
              placeholder={unidadPeso === 'lbs' ? 'ej: 145' : 'ej: 65'}
              value={peso}
              onChange={e => setPeso(e.target.value)}
              inputMode="decimal"
            />
            <div className={styles.unitToggle}>
              <button
                className={`${styles.unitBtn} ${unidadPeso === 'lbs' ? styles.unitActive : ''}`}
                onClick={() => setUnidadPeso('lbs')}
              >lbs</button>
              <button
                className={`${styles.unitBtn} ${unidadPeso === 'kg' ? styles.unitActive : ''}`}
                onClick={() => setUnidadPeso('kg')}
              >kg</button>
            </div>
          </div>
        </div>

        {/* Talla */}
        <div className="input-wrapper mt-md">
          <label className="input-label">Tu estatura</label>
          <div className={styles.inputRow}>
            <input
              id="talla"
              className="input-field"
              type="number"
              placeholder={unidadTalla === 'in' ? 'ej: 65' : 'ej: 165'}
              value={talla}
              onChange={e => setTalla(e.target.value)}
              inputMode="decimal"
            />
            <div className={styles.unitToggle}>
              <button
                className={`${styles.unitBtn} ${unidadTalla === 'in' ? styles.unitActive : ''}`}
                onClick={() => setUnidadTalla('in')}
              >in</button>
              <button
                className={`${styles.unitBtn} ${unidadTalla === 'cm' ? styles.unitActive : ''}`}
                onClick={() => setUnidadTalla('cm')}
              >cm</button>
            </div>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </div>

      <div className={styles.actions}>
        <button id="step2-atras" className="btn btn-ghost" onClick={onRetroceder}>← Atrás</button>
        <button id="step2-continuar" className="btn btn-primary" onClick={handleContinuar}>Continuar</button>
      </div>
    </div>
  );
}
