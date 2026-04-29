'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useStore';
import { useSesionStore } from '@/store/useStore';
import { generarRutina } from '@/logic/workout/generadorRutina';
import { guardarRutina, guardarSesion, contarSesiones } from '@/db/db';
import { procesarSesion } from '@/logic/brain/brainEngine';
import { BATCH_LOGIC } from '@/truth/reference';
import SesionActiva from './SesionActiva';
import styles from './Entrenamiento.module.css';

export default function Entrenamiento() {
  const { perfil, rutinaActiva, setRutinaActiva, brainState, setBrainState, mostrarToast, setMostrarModalMedidas } = useAppStore();
  const { sesionIniciada, iniciarSesion } = useSesionStore();
  const [generando, setGenerando] = useState(false);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  if (sesionIniciada) return <SesionActiva />;

  const diasRutina = rutinaActiva?.diasPorSemana || [];

  const handleGenerarNuevaRutina = async () => {
    if (!perfil) return;
    setGenerando(true);
    try {
      const nueva = generarRutina(
        { ...perfil, nombre: 'Mi Rutina' },
        brainState || {}
      );
      await guardarRutina(nueva);
      setRutinaActiva(nueva);
      mostrarToast('¡Nueva rutina generada! 💪', 'success');
    } catch (err) {
      console.error(err);
      mostrarToast('Error generando rutina', 'error');
    } finally {
      setGenerando(false);
    }
  };

  const handleIniciarSesion = (dia) => {
    iniciarSesion(dia);
    setDiaSeleccionado(dia);
  };

  return (
    <div className="page-content animate-fade-in">
      <div className="flex justify-between items-center mb-lg">
        <div>
          <h1 className="text-title">Entrenar</h1>
          <p className="text-body">Selecciona el día de hoy</p>
        </div>
        <button
          id="generar-rutina-btn"
          className="btn btn-ghost btn-sm"
          style={{ width: 'auto', padding: '10px 14px' }}
          onClick={handleGenerarNuevaRutina}
          disabled={generando}
        >
          {generando ? '⏳' : '🔄'} Nueva
        </button>
      </div>

      {diasRutina.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
          <span style={{ fontSize: '3rem' }}>🏋️</span>
          <p className="text-subtitle mt-md">Sin rutina</p>
          <p className="text-body mt-sm">Genera tu primera rutina personalizada.</p>
          <button
            id="primera-rutina-btn"
            className="btn btn-primary mt-lg"
            onClick={handleGenerarNuevaRutina}
            disabled={generando}
          >
            {generando ? 'Generando...' : '¡Generar mi rutina! 🔥'}
          </button>
        </div>
      ) : (
        <div className={styles.diasList}>
          {diasRutina.map((dia, idx) => (
            <DiaCard key={idx} dia={dia} onIniciar={() => handleIniciarSesion(dia)} />
          ))}
        </div>
      )}
    </div>
  );
}

function DiaCard({ dia, onIniciar }) {
  const [expandido, setExpandido] = useState(false);

  const grupos = [...new Set(dia.ejercicios?.map(e => e.musculoPrimario) || [])];

  return (
    <div className={styles.diaCard}>
      <div className="flex justify-between items-center">
        <div>
          <span className="badge badge-primary mb-sm">Día {dia.diaNum}</span>
          <h3 className="text-subtitle">{dia.nombre}</h3>
          <p className="text-caption mt-sm">
            {dia.ejercicios?.length || 0} ejercicios · {grupos.join(', ')}
          </p>
        </div>
        <div className="flex flex-col gap-sm" style={{ alignItems: 'flex-end' }}>
          <button
            id={`iniciar-dia-${dia.diaNum}`}
            className="btn btn-primary btn-sm"
            style={{ width: 'auto', padding: '10px 18px' }}
            onClick={onIniciar}
          >
            💪 Iniciar
          </button>
          <button
            className="btn btn-ghost btn-sm"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.75rem' }}
            onClick={() => setExpandido(p => !p)}
          >
            {expandido ? 'Ocultar ▲' : 'Ver ▼'}
          </button>
        </div>
      </div>

      {expandido && (
        <div className={styles.ejerciciosPreview}>
          <div className="divider" />
          {dia.ejercicios?.map((ej, i) => (
            <div key={i} className={styles.ejPreviewItem}>
              <span className={styles.ejNum}>{i + 1}</span>
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{ej.nombre}</p>
                <p className="text-caption">
                  {ej.setsBase} sets · {ej.repsBase?.[0]}-{ej.repsBase?.[1]} reps
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
