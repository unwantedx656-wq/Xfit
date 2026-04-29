'use client';

import { useState } from 'react';
import { filtrarPorEquipamiento } from '@/data/ejercicios';

export default function ModalEditarEjercicio({ ejercicio, equipamientoUsuario, ejerciciosEnSesion, onGuardar, onReemplazar, onCerrar }) {
  const esNuevo = ejercicio?.esNuevo;
  const [peso, setPeso] = useState(ejercicio?.pesoActual || '');
  const [reps, setReps] = useState(ejercicio?.repsActuales || ejercicio?.repsBase?.[1] || 12);
  const [sets, setSets] = useState(ejercicio?.setsActuales || ejercicio?.setsBase || 3);
  const [tab, setTab] = useState(esNuevo ? 'agregar' : 'editar');
  const [busqueda, setBusqueda] = useState('');

  const todosEjercicios = filtrarPorEquipamiento(equipamientoUsuario);
  const candidatos = todosEjercicios.filter(e =>
    !ejerciciosEnSesion.includes(e.id) &&
    (busqueda === '' || e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
     e.musculoPrimario.includes(busqueda.toLowerCase()))
  );

  const muscActual = ejercicio?.musculoPrimario;
  const alternativas = candidatos.filter(e =>
    e.id !== ejercicio?.id && e.musculoPrimario === muscActual
  );

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-sheet" style={{ maxHeight: '85dvh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />

        {!esNuevo && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-lg)' }}>
            {['editar', 'reemplazar'].map(t => (
              <button
                key={t}
                className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-ghost'}`}
                style={{ flex: 1, width: 'auto' }}
                onClick={() => setTab(t)}
              >
                {t === 'editar' ? '✏ Editar' : '🔄 Reemplazar'}
              </button>
            ))}
          </div>
        )}

        {/* TAB: Editar parámetros */}
        {(tab === 'editar' && !esNuevo) && (
          <div>
            <h3 className="text-subtitle mb-md">{ejercicio?.nombre}</h3>

            <div className="input-wrapper">
              <label className="input-label">Peso (lbs)</label>
              <input className="input-field" type="number" value={peso}
                onChange={e => setPeso(e.target.value)} placeholder="Sin peso / solo peso corporal"
                inputMode="decimal" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
              <div className="input-wrapper">
                <label className="input-label">Reps</label>
                <input className="input-field" type="number" value={reps}
                  onChange={e => setReps(Number(e.target.value))} inputMode="numeric" />
              </div>
              <div className="input-wrapper">
                <label className="input-label">Sets</label>
                <input className="input-field" type="number" value={sets}
                  onChange={e => setSets(Number(e.target.value))} inputMode="numeric" />
              </div>
            </div>

            <button
              id="guardar-edicion-btn"
              className="btn btn-primary mt-lg"
              onClick={() => onGuardar({ pesoActual: peso ? Number(peso) : null, repsActuales: reps, setsActuales: sets })}
            >
              Guardar cambios
            </button>
          </div>
        )}

        {/* TAB: Reemplazar / Agregar */}
        {(tab === 'reemplazar' || esNuevo) && (
          <div>
            <h3 className="text-subtitle mb-md">{esNuevo ? 'Agregar ejercicio' : `Reemplazar: ${ejercicio?.nombre}`}</h3>

            <input
              className="input-field mb-md"
              type="text"
              placeholder="Buscar por nombre o músculo..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />

            {!esNuevo && alternativas.length > 0 && busqueda === '' && (
              <>
                <p className="input-label mb-sm">Mismo músculo</p>
                {alternativas.slice(0, 3).map(ej => (
                  <EjercicioBuscadoItem key={ej.id} ejercicio={ej} onSeleccionar={() => onReemplazar(ej)} />
                ))}
                <div className="divider" />
              </>
            )}

            <p className="input-label mb-sm">Todos los ejercicios</p>
            {candidatos.slice(0, 10).map(ej => (
              <EjercicioBuscadoItem
                key={ej.id}
                ejercicio={ej}
                onSeleccionar={() => esNuevo ? onGuardar(ej) : onReemplazar(ej)}
              />
            ))}

            {candidatos.length === 0 && (
              <p className="text-body text-center" style={{ padding: 'var(--space-lg)' }}>
                Sin resultados. Prueba otro término.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EjercicioBuscadoItem({ ejercicio, onSeleccionar }) {
  return (
    <button
      id={`seleccionar-${ejercicio.id}`}
      onClick={onSeleccionar}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px', marginBottom: '8px',
        background: 'var(--color-surface)', border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left',
        transition: 'var(--transition-fast)', fontFamily: 'var(--font-base)',
      }}
    >
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)' }}>{ejercicio.nombre}</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)', marginTop: '2px' }}>
          {ejercicio.musculoPrimario} · {ejercicio.tipo}
        </p>
      </div>
      <span style={{ color: 'var(--color-primary)', fontSize: '1rem' }}>+</span>
    </button>
  );
}
