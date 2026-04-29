'use client';
import { useState } from 'react';
import styles from './StepShared.module.css';

export default function Step1Identidad({ datos, onAvanzar }) {
  const [nombre, setNombre] = useState(datos.nombre || '');
  const [fechaNacimiento, setFechaNacimiento] = useState(datos.fechaNacimiento || '');
  const [error, setError] = useState('');

  const handleContinuar = () => {
    if (!nombre.trim()) { setError('Ponele tu nombre 💜'); return; }
    if (!fechaNacimiento) { setError('Necesito tu fecha de nacimiento'); return; }
    setError('');
    onAvanzar({ nombre: nombre.trim(), fechaNacimiento });
  };

  return (
    <div className={styles.stepWrap}>
      <div className={styles.heroSection}>
        <div className={styles.emoji}>👋</div>
        <h1 className="text-display gradient-text">Bienvenida</h1>
        <p className="text-body mt-sm">Vamos a crear tu perfil único. Solo son unos minutos.</p>
      </div>

      <div className={styles.form}>
        <div className="input-wrapper">
          <label className="input-label" htmlFor="nombre">¿Cómo te llamas?</label>
          <input
            id="nombre"
            className="input-field"
            type="text"
            placeholder="Escribe tu nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            autoFocus
          />
        </div>

        <div className="input-wrapper mt-md">
          <label className="input-label" htmlFor="fechaNacimiento">¿Cuándo es tu cumpleaños?</label>
          <input
            id="fechaNacimiento"
            className="input-field"
            type="date"
            value={fechaNacimiento}
            max={new Date().toISOString().split('T')[0]}
            onChange={e => setFechaNacimiento(e.target.value)}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </div>

      <div className={styles.actions}>
        <button id="step1-continuar" className="btn btn-primary" onClick={handleContinuar}>
          Continuar ✨
        </button>
      </div>
    </div>
  );
}
