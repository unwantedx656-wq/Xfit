'use client';
import { useState } from 'react';
import styles from './StepShared.module.css';

const DIAS_OPTIONS = [2,3,4,5,6];
const EJERCICIOS_OPTIONS = [4,5,6,7,8];
const TIEMPO_OPTIONS = [
  { val: 30, label: '30 min' },
  { val: 45, label: '45 min' },
  { val: 60, label: '1 hora' },
  { val: 90, label: '90 min' },
];

export default function Step5Disponibilidad({ datos, onAvanzar, onRetroceder }) {
  const [dias, setDias] = useState(datos.diasSemana || 3);
  const [ejercicios, setEjercicios] = useState(datos.ejerciciosPorSesion || 6);
  const [tiempo, setTiempo] = useState(datos.tiempoSesion || 60);

  const handleContinuar = () => {
    onAvanzar({ diasSemana: dias, ejerciciosPorSesion: ejercicios, tiempoSesion: tiempo });
  };

  return (
    <div className={styles.stepWrap}>
      <div className={styles.heroSection}>
        <div className={styles.emoji}>📅</div>
        <h1 className="text-display gradient-text">Tu plan</h1>
        <p className="text-body mt-sm">¿Cuánto tiempo tenés? Sé honesta, la consistencia gana.</p>
      </div>

      <div className={styles.form}>
        <label className="input-label">Días por semana que vas a entrenar</label>
        <div className={styles.chipRow} style={{ marginTop: '8px' }}>
          {DIAS_OPTIONS.map(d => (
            <button
              key={d}
              id={`dias-${d}`}
              className={`${styles.chip} ${dias === d ? styles.chipActive : ''}`}
              onClick={() => setDias(d)}
            >
              {d}
            </button>
          ))}
        </div>

        <label className="input-label mt-lg">Ejercicios por sesión</label>
        <div className={styles.chipRow} style={{ marginTop: '8px' }}>
          {EJERCICIOS_OPTIONS.map(e => (
            <button
              key={e}
              id={`ejercicios-${e}`}
              className={`${styles.chip} ${ejercicios === e ? styles.chipActive : ''}`}
              onClick={() => setEjercicios(e)}
            >
              {e}
            </button>
          ))}
        </div>

        <label className="input-label mt-lg">Tiempo disponible por sesión</label>
        <div className={styles.chipRow} style={{ marginTop: '8px', flexWrap: 'wrap' }}>
          {TIEMPO_OPTIONS.map(t => (
            <button
              key={t.val}
              id={`tiempo-${t.val}`}
              className={`${styles.chip} ${tiempo === t.val ? styles.chipActive : ''}`}
              onClick={() => setTiempo(t.val)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button id="step5-atras" className="btn btn-ghost" onClick={onRetroceder}>← Atrás</button>
        <button id="step5-continuar" className="btn btn-primary" onClick={handleContinuar}>Continuar</button>
      </div>
    </div>
  );
}
