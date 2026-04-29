'use client';
import { useEffect } from 'react';
import styles from './StepShared.module.css';

export default function Step7Final({ datos, onFinalizar, generando }) {
  useEffect(() => {
    // Auto-iniciar después de 1.5s de mostrar la pantalla
    const t = setTimeout(() => { if (!generando) onFinalizar(); }, 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={styles.stepWrap} style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <div style={{ textAlign: 'center', animation: 'fadeInUp 0.5s ease both' }}>
        <div className={styles.emoji} style={{ fontSize: '5rem' }}>
          {generando ? '⚙️' : '💜'}
        </div>
        <h1 className="text-display gradient-text" style={{ marginTop: '1rem' }}>
          {generando ? 'Configurando...' : '¡Todo listo!'}
        </h1>
        <p className="text-body mt-md" style={{ maxWidth: '280px', margin: '1rem auto 0' }}>
          {generando
            ? 'Entrenando tu cerebro y generando tu primera rutina...'
            : `¡Hola, ${datos.nombre || 'guerrera'}! Tu rutina inteligente está casi lista.`
          }
        </p>

        {generando && (
          <div style={{
            width: '60px', height: '4px', background: 'var(--gradient-primary)',
            borderRadius: 'var(--radius-full)', margin: '2rem auto 0',
            animation: 'pulse-glow 1s infinite',
          }} />
        )}
      </div>
    </div>
  );
}
