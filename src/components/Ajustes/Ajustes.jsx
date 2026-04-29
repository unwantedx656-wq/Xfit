'use client';

import { useState } from 'react';
import { guardarConfig } from '@/db/db';
import { useAppStore } from '@/store/useStore';
import { EQUIPMENT_LIST, USER_GOALS } from '@/truth/reference';
import styles from './Ajustes.module.css';

export default function Ajustes() {
  const { perfil, setPerfil, mostrarToast } = useAppStore();
  const [seccionAbierta, setSeccionAbierta] = useState(null);
  const [datos, setDatos] = useState({ ...perfil });

  const handleGuardar = async () => {
    try {
      await guardarConfig(datos);
      setPerfil(datos);
      mostrarToast('¡Ajustes guardados! ✨', 'success');
      setSeccionAbierta(null);
    } catch (err) {
      console.error(err);
      mostrarToast('Error guardando ajustes', 'error');
    }
  };

  const toggleEquipamiento = (id) => {
    const actual = datos.equipamiento || [];
    setDatos(p => ({
      ...p,
      equipamiento: actual.includes(id) ? actual.filter(e => e !== id) : [...actual, id],
    }));
  };

  const SECCIONES = [
    { id: 'perfil',       label: 'Perfil Personal',    emoji: '👤' },
    { id: 'metricas',     label: 'Métricas y Peso',    emoji: '⚖️' },
    { id: 'objetivo',     label: 'Objetivo',           emoji: '🎯' },
    { id: 'plan',         label: 'Plan de Entrenamiento', emoji: '📅' },
    { id: 'equipamiento', label: 'Equipamiento',       emoji: '🏋️' },
  ];

  return (
    <div className="page-content animate-fade-in">
      <h1 className="text-title mb-lg">Ajustes</h1>

      <div className="flex flex-col gap-sm">
        {SECCIONES.map(sec => (
          <div key={sec.id} className={styles.seccion}>
            <button
              id={`sec-${sec.id}`}
              className={styles.seccionHeader}
              onClick={() => setSeccionAbierta(seccionAbierta === sec.id ? null : sec.id)}
            >
              <span style={{ fontSize: '1.3rem' }}>{sec.emoji}</span>
              <span className="text-subtitle">{sec.label}</span>
              <span className={`${styles.chevron} ${seccionAbierta === sec.id ? styles.chevronOpen : ''}`}>›</span>
            </button>

            {seccionAbierta === sec.id && (
              <div className={styles.seccionBody}>
                {sec.id === 'perfil' && (
                  <>
                    <div className="input-wrapper">
                      <label className="input-label">Nombre</label>
                      <input className="input-field" value={datos.nombre || ''} onChange={e => setDatos(p => ({ ...p, nombre: e.target.value }))} />
                    </div>
                    <div className="input-wrapper mt-md">
                      <label className="input-label">Fecha de nacimiento</label>
                      <input className="input-field" type="date" value={datos.fechaNacimiento || ''} onChange={e => setDatos(p => ({ ...p, fechaNacimiento: e.target.value }))} />
                    </div>
                  </>
                )}

                {sec.id === 'metricas' && (
                  <>
                    <div className="input-wrapper">
                      <label className="input-label">Peso actual ({datos.unidadPeso || 'lbs'})</label>
                      <input className="input-field" type="number" value={datos.pesoActual || ''} onChange={e => setDatos(p => ({ ...p, pesoActual: Number(e.target.value) }))} inputMode="decimal" />
                    </div>
                    <div className="input-wrapper mt-md">
                      <label className="input-label">Peso meta ({datos.unidadPeso || 'lbs'})</label>
                      <input className="input-field" type="number" value={datos.pesoMeta || ''} onChange={e => setDatos(p => ({ ...p, pesoMeta: Number(e.target.value) }))} inputMode="decimal" />
                    </div>
                    <div className="input-wrapper mt-md">
                      <label className="input-label">Estatura ({datos.unidadTalla || 'in'})</label>
                      <input className="input-field" type="number" value={datos.talla || ''} onChange={e => setDatos(p => ({ ...p, talla: Number(e.target.value) }))} inputMode="decimal" />
                    </div>
                  </>
                )}

                {sec.id === 'objetivo' && (
                  <div className="flex flex-col gap-sm">
                    {Object.values(USER_GOALS).map(goal => (
                      <button
                        key={goal.id}
                        id={`objetivo-${goal.id}`}
                        onClick={() => setDatos(p => ({ ...p, objetivo: goal.id }))}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '14px', borderRadius: 'var(--radius-lg)',
                          background: datos.objetivo === goal.id ? 'rgba(98,0,238,0.2)' : 'var(--color-surface)',
                          border: `1px solid ${datos.objetivo === goal.id ? 'var(--color-primary)' : 'var(--glass-border)'}`,
                          cursor: 'pointer', fontFamily: 'var(--font-base)', transition: 'var(--transition-fast)',
                        }}
                      >
                        <span style={{ fontSize: '1.5rem' }}>{goal.icon}</span>
                        <span style={{ color: 'var(--color-text)', fontSize: '0.9rem', fontWeight: 500 }}>{goal.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {sec.id === 'plan' && (
                  <>
                    <div className="input-wrapper">
                      <label className="input-label">Días por semana ({datos.diasSemana || 3})</label>
                      <input className="input-field" type="range" min="2" max="6" value={datos.diasSemana || 3}
                        onChange={e => setDatos(p => ({ ...p, diasSemana: Number(e.target.value) }))}
                        style={{ width: '100%', accentColor: 'var(--color-primary-deep)' }} />
                    </div>
                    <div className="input-wrapper mt-md">
                      <label className="input-label">Ejercicios por sesión ({datos.ejerciciosPorSesion || 6})</label>
                      <input className="input-field" type="range" min="4" max="8" value={datos.ejerciciosPorSesion || 6}
                        onChange={e => setDatos(p => ({ ...p, ejerciciosPorSesion: Number(e.target.value) }))}
                        style={{ width: '100%', accentColor: 'var(--color-primary-deep)' }} />
                    </div>
                  </>
                )}

                {sec.id === 'equipamiento' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {EQUIPMENT_LIST.map(eq => (
                      <button
                        key={eq.id}
                        id={`ajuste-equip-${eq.id}`}
                        onClick={() => toggleEquipamiento(eq.id)}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                          padding: '12px 8px', borderRadius: 'var(--radius-md)', minHeight: '70px',
                          background: (datos.equipamiento || []).includes(eq.id) ? 'rgba(98,0,238,0.2)' : 'var(--color-surface)',
                          border: `1px solid ${(datos.equipamiento || []).includes(eq.id) ? 'var(--color-primary)' : 'var(--glass-border)'}`,
                          cursor: 'pointer', fontFamily: 'var(--font-base)', transition: 'var(--transition-fast)',
                        }}
                      >
                        <span style={{ fontSize: '1.4rem' }}>{eq.emoji}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.2 }}>{eq.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                <button id={`guardar-${sec.id}`} className="btn btn-primary mt-lg" onClick={handleGuardar}>
                  Guardar cambios
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info de versión */}
      <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
        <p className="text-caption">Xfit v1.0 · Offline-First 💜</p>
        <p className="text-caption">Todos tus datos están guardados en tu dispositivo.</p>
      </div>
    </div>
  );
}
