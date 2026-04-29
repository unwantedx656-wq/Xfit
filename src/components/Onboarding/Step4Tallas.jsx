'use client';
import { useState } from 'react';
import styles from './StepShared.module.css';

const MEDIDAS = [
  { id: 'cintura', label: 'Cintura', emoji: '👗', tip: 'La parte más delgada del abdomen' },
  { id: 'cadera',  label: 'Cadera',  emoji: '🍑', tip: 'La parte más ancha de la cadera' },
  { id: 'muslo',   label: 'Muslo',   emoji: '🦵', tip: 'La parte más ancha del muslo' },
  { id: 'brazo',   label: 'Brazo',   emoji: '💪', tip: 'Bíceps contraído' },
];

export default function Step4Tallas({ datos, onAvanzar, onRetroceder }) {
  const [medidas, setMedidas] = useState({
    cintura: datos.cintura || '',
    cadera:  datos.cadera  || '',
    muslo:   datos.muslo   || '',
    brazo:   datos.brazo   || '',
  });
  const unidad = datos.unidadTalla || 'in';

  const handleChange = (campo, val) => setMedidas(p => ({ ...p, [campo]: val }));

  const handleContinuar = () => {
    onAvanzar({ ...medidas });
  };

  return (
    <div className={styles.stepWrap}>
      <div className={styles.heroSection}>
        <div className={styles.emoji}>📏</div>
        <h1 className="text-display gradient-text">Tus medidas</h1>
        <p className="text-body mt-sm">
          Opcionales, pero poderosas. El cambio en medidas supera al cambio en la báscula.
        </p>
      </div>

      <div className={styles.form}>
        {MEDIDAS.map(m => (
          <div key={m.id} className="input-wrapper mt-md">
            <label className="input-label" htmlFor={m.id}>
              {m.emoji} {m.label}
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-faint)', marginLeft: '6px', fontWeight: 400 }}>
                ({m.tip})
              </span>
            </label>
            <div className={styles.inputRow}>
              <input
                id={m.id}
                className="input-field"
                type="number"
                placeholder={`en ${unidad}`}
                value={medidas[m.id]}
                onChange={e => handleChange(m.id, e.target.value)}
                inputMode="decimal"
              />
              <span className={styles.unitLabel}>{unidad}</span>
            </div>
          </div>
        ))}

        <p className={styles.tip}>
          💡 Puedes saltear esto y agregarlo después en tu perfil.
        </p>
      </div>

      <div className={styles.actions}>
        <button id="step4-atras" className="btn btn-ghost" onClick={onRetroceder}>← Atrás</button>
        <button id="step4-continuar" className="btn btn-primary" onClick={handleContinuar}>Continuar</button>
      </div>
    </div>
  );
}
