'use client';
import { useState } from 'react';
import { USER_GOALS } from '@/truth/reference';
import styles from './StepShared.module.css';

export default function Step3Objetivos({ datos, onAvanzar, onRetroceder }) {
  const [objetivo, setObjetivo] = useState(datos.objetivo || 'recomp');
  const [pesoMeta, setPesoMeta] = useState(datos.pesoMeta || '');
  const [error, setError] = useState('');

  const handleContinuar = () => {
    if (!pesoMeta || isNaN(Number(pesoMeta)) || Number(pesoMeta) <= 0) {
      setError('¿A cuánto quieres llegar?');
      return;
    }
    setError('');
    onAvanzar({ objetivo, pesoMeta: Number(pesoMeta) });
  };

  return (
    <div className={styles.stepWrap}>
      <div className={styles.heroSection}>
        <div className={styles.emoji}>🎯</div>
        <h1 className="text-display gradient-text">Tu destino</h1>
        <p className="text-body mt-sm">¿Qué querés lograr? Podés cambiar esto en ajustes cuando quieras.</p>
      </div>

      <div className={styles.form}>
        <label className="input-label">¿Cuál es tu objetivo principal?</label>
        <div className={styles.goalCards} style={{ marginTop: '8px' }}>
          {Object.values(USER_GOALS).map(goal => (
            <button
              key={goal.id}
              id={`goal-${goal.id}`}
              className={`${styles.goalCard} ${objetivo === goal.id ? styles.goalActive : ''}`}
              onClick={() => setObjetivo(goal.id)}
            >
              <span className={styles.goalEmoji}>{goal.icon}</span>
              <span className={styles.goalLabel}>{goal.label}</span>
              {objetivo === goal.id && <div className={styles.goalCheck}>✓</div>}
            </button>
          ))}
        </div>

        <div className="input-wrapper mt-lg">
          <label className="input-label" htmlFor="peso-meta">
            Tu peso meta ({datos.unidadPeso || 'lbs'})
          </label>
          <input
            id="peso-meta"
            className="input-field"
            type="number"
            placeholder={datos.unidadPeso === 'kg' ? 'ej: 58' : 'ej: 130'}
            value={pesoMeta}
            onChange={e => setPesoMeta(e.target.value)}
            inputMode="decimal"
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </div>

      <div className={styles.actions}>
        <button id="step3-atras" className="btn btn-ghost" onClick={onRetroceder}>← Atrás</button>
        <button id="step3-continuar" className="btn btn-primary" onClick={handleContinuar}>Continuar</button>
      </div>
    </div>
  );
}
