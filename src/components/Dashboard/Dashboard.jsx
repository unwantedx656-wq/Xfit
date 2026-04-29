'use client';

import { useAppStore } from '@/store/useStore';
import { USER_GOALS } from '@/truth/reference';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { perfil, rutinaActiva, brainState, setVista } = useAppStore();

  const nombre = perfil?.nombre || 'Guerrera';
  const saludo = _getSaludo();
  const objetivo = perfil?.objetivo ? USER_GOALS[perfil.objetivo.toUpperCase()] : null;
  const diasPorSemana = rutinaActiva?.diasPorSemana || [];
  const totalSesiones = brainState?.totalSessions || 0;
  const proximoBatch = 12 - (totalSesiones % 12);

  // Calcular progreso hacia el peso meta
  const pesoActual = perfil?.pesoActual || 0;
  const pesoMeta   = perfil?.pesoMeta   || 0;
  const pesoDiff   = pesoActual - pesoMeta;

  return (
    <div className="page-content animate-fade-in">
      {/* Header */}
      <div className={styles.header}>
        <div>
          <p className="text-caption">{saludo} 👋</p>
          <h1 className="text-title gradient-text">{nombre}</h1>
        </div>
        <div className={styles.streakBadge}>
          <span>🔥</span>
          <span>{totalSesiones}</span>
        </div>
      </div>

      {/* Card de progreso de peso */}
      {pesoActual > 0 && pesoMeta > 0 && (
        <div className={`glass-card mt-md ${styles.weightCard}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-caption">Peso actual</p>
              <p className="text-title">{pesoActual} <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{perfil?.unidadPeso || 'lbs'}</span></p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="text-caption">Meta</p>
              <p className="text-title gradient-text-accent">{pesoMeta} {perfil?.unidadPeso || 'lbs'}</p>
            </div>
          </div>
          {pesoDiff > 0 && (
            <div style={{ marginTop: 'var(--space-md)' }}>
              <div className="flex justify-between mb-sm">
                <span className="text-caption">Faltan {pesoDiff.toFixed(1)} {perfil?.unidadPeso}</span>
                <span className="text-caption">{Math.min(100, Math.round((1 - pesoDiff / (pesoActual - pesoMeta + 0.01)) * 100))}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '5%' }} />
              </div>
            </div>
          )}
          {objetivo && (
            <div className="mt-sm">
              <span className="badge badge-primary">{objetivo.icon} {objetivo.label}</span>
            </div>
          )}
        </div>
      )}

      {/* Card del cerebro */}
      <div className={`gradient-card mt-md ${styles.brainCard}`}>
        <div className="flex items-center gap-sm mb-md">
          <span style={{ fontSize: '1.5rem' }}>🧠</span>
          <div>
            <p className="text-subtitle">Tu Cerebro</p>
            <p className="text-caption">{totalSesiones} sesiones completadas</p>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(12 - proximoBatch) / 12 * 100}%` }} />
        </div>
        <p className="text-caption mt-sm">
          {proximoBatch === 12
            ? '¡Análisis completado! 🎉'
            : `${proximoBatch} sesión${proximoBatch !== 1 ? 'es' : ''} para el próximo análisis`}
        </p>
      </div>

      {/* Rutina activa */}
      {diasPorSemana.length > 0 ? (
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <div className="flex justify-between items-center mb-md">
            <h2 className="text-subtitle">Tu rutina activa</h2>
            <button
              className="btn btn-ghost btn-sm"
              style={{ width: 'auto', padding: '8px 14px' }}
              onClick={() => setVista('training')}
            >
              Ver todo →
            </button>
          </div>

          <div className={styles.rutinaDias}>
            {diasPorSemana.map((dia, i) => (
              <div key={i} className={`glass-card ${styles.diaCard}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="badge badge-primary">Día {dia.diaNum}</span>
                    <p className="text-subtitle mt-sm">{dia.nombre}</p>
                    <p className="text-caption mt-sm">{dia.ejercicios?.length || 0} ejercicios</p>
                  </div>
                  <button
                    id={`iniciar-dia-${dia.diaNum}`}
                    className="btn btn-primary btn-sm"
                    style={{ width: 'auto', padding: '10px 16px' }}
                    onClick={() => setVista('training')}
                  >
                    Iniciar 💪
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={`glass-card mt-md ${styles.emptyState}`}>
          <span style={{ fontSize: '3rem' }}>📋</span>
          <p className="text-subtitle mt-md">Sin rutina activa</p>
          <p className="text-body mt-sm">Ve a "Entrenar" para generar tu primera rutina.</p>
          <button className="btn btn-primary mt-lg" onClick={() => setVista('training')}>
            Generar Rutina 🔥
          </button>
        </div>
      )}
    </div>
  );
}

function _getSaludo() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 18) return 'Buenas tardes';
  return 'Buenas noches';
}
