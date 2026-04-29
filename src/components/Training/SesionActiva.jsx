'use client';

import { useState } from 'react';
import { useSesionStore, useAppStore } from '@/store/useStore';
import { guardarSesion, guardarProgresion, contarSesiones } from '@/db/db';
import { procesarSesion } from '@/logic/brain/brainEngine';
import { evaluarGhostFail } from '@/logic/brain/brainEngine';
import { filtrarPorEquipamiento } from '@/data/ejercicios';
import { TRAINING_LAWS } from '@/truth/reference';
import { BATCH_LOGIC } from '@/truth/reference';
import ModalEditarEjercicio from './ModalEditarEjercicio';
import styles from './SesionActiva.module.css';

export default function SesionActiva() {
  const {
    sesionActiva, ejerciciosActivos,
    marcarEjercicioCompletado, actualizarEjercicio, reemplazarEjercicio, agregarEjercicio,
    finalizarSesion, resetSesion,
  } = useSesionStore();

  const { brainState, setBrainState, perfil, mostrarToast, setMostrarModalMedidas } = useAppStore();

  const [ejercicioEditando, setEjercicioEditando] = useState(null);
  const [confirmandoFin, setConfirmandoFin] = useState(false);
  const [sessionFinalizada, setSessionFinalizada] = useState(false);

  const completados  = ejerciciosActivos.filter(e => e.completado).length;
  const total        = ejerciciosActivos.length;
  const progreso     = total > 0 ? (completados / total) * 100 : 0;
  const todoCompleto = completados === total;

  const handleFinalizarSesion = async () => {
    const datos = finalizarSesion();
    try {
      await guardarSesion(datos);

      // Guardar progresión de cada ejercicio completado
      for (const ej of ejerciciosActivos.filter(e => e.completado)) {
        await guardarProgresion({
          sesionId: datos.fecha,
          ejercicioId: ej.id,
          ejercicioNombre: ej.nombre,
          pesoUsado: ej.pesoActual,
          repsRealizadas: ej.repsActuales,
          setCompletado: ej.setsActuales,
        });
      }

      // Actualizar el cerebro
      const nuevoState = await procesarSesion(datos, brainState || {});
      setBrainState(nuevoState);

      // Verificar trigger de medidas (cada 12 sesiones)
      const total_sesiones = await contarSesiones();
      if (total_sesiones > 0 && total_sesiones % BATCH_LOGIC.SESSIONS_PER_BATCH === 0) {
        setMostrarModalMedidas(true);
      }

      setSessionFinalizada(true);
      mostrarToast('¡Sesión completada! 💪🔥', 'success', 4000);

    } catch (err) {
      console.error('Error finalizando sesión:', err);
      mostrarToast('Error guardando la sesión', 'error');
    }
  };

  if (sessionFinalizada) {
    return (
      <div className={styles.finContainer}>
        <div className={styles.finCard}>
          <div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '1rem' }}>🎉</div>
          <h2 className="text-title gradient-text text-center">¡Terminaste!</h2>
          <p className="text-body text-center mt-sm">
            {completados} de {total} ejercicios completados.
          </p>
          {completados < total && (
            <p className="text-caption text-center mt-sm" style={{ color: 'var(--color-accent)' }}>
              El cerebro aprendió de esta sesión 🧠
            </p>
          )}
          <button
            id="volver-entrenamiento-btn"
            className="btn btn-primary mt-lg"
            onClick={resetSesion}
          >
            Volver al inicio 🏠
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header de sesión */}
      <div className={styles.header}>
        <div>
          <p className="text-caption">Sesión activa</p>
          <h2 className="text-title">{sesionActiva?.nombre}</h2>
        </div>
        <button
          id="cancelar-sesion-btn"
          className="btn btn-ghost btn-sm"
          style={{ width: 'auto', padding: '8px 14px' }}
          onClick={() => setConfirmandoFin(true)}
        >
          ✕
        </button>
      </div>

      {/* Barra de progreso */}
      <div className={styles.progressSection}>
        <div className="flex justify-between mb-sm">
          <span className="text-caption">{completados} / {total} completados</span>
          <span className="text-caption">{Math.round(progreso)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progreso}%` }} />
        </div>
      </div>

      {/* Lista de ejercicios */}
      <div className={styles.ejerciciosList}>
        {ejerciciosActivos.map((ej, idx) => {
          const ghostStatus = evaluarGhostFail(ej.id, brainState);
          return (
            <EjercicioItem
              key={ej.id}
              ejercicio={ej}
              numero={idx + 1}
              ghostStatus={ghostStatus}
              onToggle={() => marcarEjercicioCompletado(ej.id)}
              onEditar={() => setEjercicioEditando(ej)}
            />
          );
        })}

        {/* Botón de agregar ejercicio */}
        <button
          id="agregar-ejercicio-btn"
          className={`${styles.addEjercicioBtn}`}
          onClick={() => {
            // Abrir modal para agregar ejercicio
            setEjercicioEditando({ id: '__nuevo__', nombre: '', esNuevo: true });
          }}
        >
          + Agregar ejercicio
        </button>
      </div>

      {/* Botón de finalizar */}
      <div className={styles.finFooter}>
        <button
          id="finalizar-sesion-btn"
          className={`btn ${todoCompleto ? 'btn-accent' : 'btn-primary'}`}
          onClick={handleFinalizarSesion}
        >
          {todoCompleto ? '🎉 ¡Sesión completa!' : '✓ Finalizar sesión'}
        </button>
      </div>

      {/* Modal de edición */}
      {ejercicioEditando && (
        <ModalEditarEjercicio
          ejercicio={ejercicioEditando}
          equipamientoUsuario={perfil?.equipamiento || []}
          ejerciciosEnSesion={ejerciciosActivos.map(e => e.id)}
          onGuardar={(cambios) => {
            if (ejercicioEditando.esNuevo) {
              agregarEjercicio({ ...ejercicioEditando, ...cambios });
            } else {
              actualizarEjercicio(ejercicioEditando.id, cambios);
            }
            setEjercicioEditando(null);
          }}
          onReemplazar={(nuevoEj) => {
            reemplazarEjercicio(ejercicioEditando.id, nuevoEj);
            setEjercicioEditando(null);
          }}
          onCerrar={() => setEjercicioEditando(null)}
        />
      )}

      {/* Confirm de cancelar sesión */}
      {confirmandoFin && (
        <div className="modal-overlay" onClick={() => setConfirmandoFin(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <h3 className="text-subtitle text-center">¿Salir de la sesión?</h3>
            <p className="text-body text-center mt-sm">Tu progreso de esta sesión no se guardará.</p>
            <button id="confirmar-cancelar-btn" className="btn btn-accent mt-lg" onClick={resetSesion}>
              Sí, salir
            </button>
            <button className="btn btn-ghost mt-sm" onClick={() => setConfirmandoFin(false)}>
              Seguir entrenando
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EjercicioItem({ ejercicio, numero, ghostStatus, onToggle, onEditar }) {
  const descanso = TRAINING_LAWS.REST_PERIODS[ejercicio.descanso] || 120;

  return (
    <div className={`checklist-item ${ejercicio.completado ? 'completed' : ''} ${styles.ejercicioItem}`}>
      {/* Checkbox */}
      <button
        id={`check-${ejercicio.id}`}
        className="checklist-checkbox"
        onClick={onToggle}
        style={{ flexShrink: 0 }}
      >
        {ejercicio.completado ? '✓' : ''}
      </button>

      {/* Info del ejercicio */}
      <div className={styles.ejInfo} onClick={onToggle} style={{ flex: 1, cursor: 'pointer' }}>
        <div className="flex items-center gap-sm">
          <span className={styles.ejNum}>{numero}</span>
          <p className="checklist-name" style={{ fontWeight: 600, fontSize: '0.95rem' }}>
            {ejercicio.nombre}
          </p>
        </div>
        <p className="text-caption mt-sm">
          {ejercicio.setsBase} sets · {ejercicio.repsBase?.[0]}-{ejercicio.repsBase?.[1]} reps
          {ejercicio.pesoActual ? ` · ${ejercicio.pesoActual} ${ejercicio.unidadPeso || 'lbs'}` : ''}
          · {Math.round(descanso / 60)} min descanso
        </p>
        {ghostStatus === 'alerta' && (
          <span className="badge badge-accent mt-sm">⚠ Ejercicio difícil</span>
        )}
        {ejercicio.modificadoManualmente && (
          <span className="badge badge-primary mt-sm">✏ Modificado</span>
        )}
      </div>

      {/* Botón editar */}
      <button
        id={`editar-${ejercicio.id}`}
        className="btn btn-icon"
        onClick={onEditar}
        style={{ flexShrink: 0 }}
      >
        ✏
      </button>
    </div>
  );
}
