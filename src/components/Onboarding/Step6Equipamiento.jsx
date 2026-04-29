'use client';
import { useState } from 'react';
import { EQUIPMENT_LIST } from '@/truth/reference';
import styles from './StepShared.module.css';

export default function Step6Equipamiento({ datos, onAvanzar, onRetroceder }) {
  const [seleccionado, setSeleccionado] = useState(datos.equipamiento || []);

  const toggle = (id) => {
    setSeleccionado(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleContinuar = () => {
    onAvanzar({ equipamiento: seleccionado });
  };

  const MACHINES = EQUIPMENT_LIST.filter(e => e.category === 'machine');
  const FREE    = EQUIPMENT_LIST.filter(e => e.category === 'free');
  const ACCESS  = EQUIPMENT_LIST.filter(e => e.category === 'accessory');

  const renderGrupo = (titulo, items) => (
    <div style={{ marginBottom: 'var(--space-lg)' }}>
      <p className="input-label" style={{ marginBottom: '8px' }}>{titulo}</p>
      <div className={styles.equipGrid}>
        {items.map(eq => (
          <button
            key={eq.id}
            id={`equip-${eq.id}`}
            className={`${styles.equipCard} ${seleccionado.includes(eq.id) ? styles.equipActive : ''}`}
            onClick={() => toggle(eq.id)}
          >
            <span className={styles.equipEmoji}>{eq.emoji}</span>
            <span className={styles.equipLabel}>{eq.label}</span>
            {seleccionado.includes(eq.id) && <div className={styles.equipCheck}>✓</div>}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.stepWrap}>
      <div className={styles.heroSection}>
        <div className={styles.emoji}>🏋️</div>
        <h1 className="text-display gradient-text">Tu gym</h1>
        <p className="text-body mt-sm">
          Marcá lo que tenés disponible. Solo generaremos ejercicios con tu equipamiento.
        </p>
      </div>

      <div className={styles.form}>
        {renderGrupo('Máquinas', MACHINES)}
        {renderGrupo('Peso Libre', FREE)}
        {renderGrupo('Accesorios', ACCESS)}

        <p className={styles.tip}>
          ✅ {seleccionado.length} elemento{seleccionado.length !== 1 ? 's' : ''} seleccionado{seleccionado.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className={styles.actions}>
        <button id="step6-atras" className="btn btn-ghost" onClick={onRetroceder}>← Atrás</button>
        <button
          id="step6-continuar"
          className="btn btn-primary"
          onClick={handleContinuar}
          disabled={seleccionado.length === 0}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
