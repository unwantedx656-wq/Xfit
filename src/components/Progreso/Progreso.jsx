'use client';

import { useEffect, useState } from 'react';
import { obtenerMedidas, obtenerUltimasSesiones } from '@/db/db';
import { useAppStore } from '@/store/useStore';
import styles from './Progreso.module.css';

export default function Progreso() {
  const { perfil, brainState } = useAppStore();
  const [medidas, setMedidas] = useState([]);
  const [sesiones, setSesiones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const [m, s] = await Promise.all([obtenerMedidas(), obtenerUltimasSesiones(20)]);
      setMedidas(m);
      setSesiones(s);
      setCargando(false);
    }
    cargar();
  }, []);

  const totalSesiones = brainState?.totalSessions || 0;
  const ultimaSesion  = sesiones[0];
  const primeraMedida = medidas[0];
  const ultimaMedida  = medidas[medidas.length - 1];

  const energyMap  = brainState?.energyMap || {};
  const diasBuenos = Object.entries(energyMap).filter(([, v]) => v === 'high').map(([k]) => _traducirDia(k));
  const prioridades = brainState?.musclePriorities || {};

  return (
    <div className="page-content animate-fade-in">
      <h1 className="text-title mb-lg">Tu Progreso</h1>

      {cargando ? (
        <div className={styles.skeleton}>
          <div className="skeleton" style={{ height: '100px', borderRadius: 'var(--radius-lg)', marginBottom: '12px' }} />
          <div className="skeleton" style={{ height: '80px', borderRadius: 'var(--radius-lg)' }} />
        </div>
      ) : (
        <>
          {/* Stats rápidas */}
          <div className={styles.statsGrid}>
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <p className="text-caption">Sesiones</p>
              <p className="text-display gradient-text">{totalSesiones}</p>
            </div>
            <div className="glass-card" style={{ textAlign: 'center' }}>
              <p className="text-caption">Última sesión</p>
              <p className="text-subtitle">
                {ultimaSesion ? `${ultimaSesion.ejerciciosCompletados}/${ultimaSesion.ejerciciosTotales}` : '—'}
              </p>
              {ultimaSesion && <p className="text-caption">{ultimaSesion.fecha}</p>}
            </div>
          </div>

          {/* Cambio de medidas */}
          {medidas.length >= 2 && (
            <div className={`glass-card mt-md`}>
              <h3 className="text-subtitle mb-md">📏 Cambio en medidas</h3>
              {[
                { label: 'Cintura', key: 'cintura' },
                { label: 'Cadera',  key: 'cadera'  },
                { label: 'Muslo',   key: 'muslo'   },
                { label: 'Brazo',   key: 'brazo'   },
              ].map(({ label, key }) => {
                const inicio  = Number(primeraMedida?.[key]) || 0;
                const actual  = Number(ultimaMedida?.[key])  || 0;
                const diff    = actual - inicio;
                if (!inicio || !actual) return null;
                return (
                  <div key={key} className={styles.medidaRow}>
                    <span className="text-body">{label}</span>
                    <div className="flex items-center gap-sm">
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{actual} {perfil?.unidadTalla || 'in'}</span>
                      <span className={`badge ${diff < 0 ? 'badge-success' : diff > 0 ? 'badge-accent' : 'badge-primary'}`}>
                        {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Insights del cerebro */}
          <div className={`gradient-card mt-md`}>
            <h3 className="text-subtitle mb-md">🧠 Lo que aprendió tu cerebro</h3>

            {diasBuenos.length > 0 && (
              <p className="text-body mb-sm">
                💪 Tus días de mayor energía: <strong style={{ color: 'var(--color-primary)' }}>{diasBuenos.join(', ')}</strong>
              </p>
            )}

            <p className="text-body mb-sm">Músculos con más prioridad:</p>
            <div className={styles.priorityBars}>
              {Object.entries(prioridades)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([musculo, valor]) => (
                  <div key={musculo} className={styles.priorityBar}>
                    <span className="text-caption" style={{ textTransform: 'capitalize', minWidth: '80px' }}>{musculo}</span>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className="progress-fill" style={{ width: `${Math.min(100, valor * 80)}%` }} />
                    </div>
                    <span className="text-caption" style={{ minWidth: '30px', textAlign: 'right' }}>{(valor * 100).toFixed(0)}%</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Historial de sesiones */}
          {sesiones.length > 0 && (
            <div style={{ marginTop: 'var(--space-lg)' }}>
              <h3 className="text-subtitle mb-md">📋 Historial reciente</h3>
              <div className="flex flex-col gap-sm">
                {sesiones.slice(0, 5).map((s, i) => (
                  <div key={i} className="glass-card" style={{ padding: 'var(--space-md)' }}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.fecha}</p>
                        <p className="text-caption">{s.diaSemana} · {s.duracion} min</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 700, color: s.ratioCompletado >= 0.8 ? '#4ADE80' : 'var(--color-accent)' }}>
                          {s.ejerciciosCompletados}/{s.ejerciciosTotales}
                        </p>
                        <p className="text-caption">{Math.round(s.ratioCompletado * 100)}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sesiones.length === 0 && medidas.length === 0 && (
            <div className="glass-card mt-md" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
              <span style={{ fontSize: '3rem' }}>📊</span>
              <p className="text-subtitle mt-md">Sin datos aún</p>
              <p className="text-body mt-sm">Completa tu primera sesión para ver tu progreso.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function _traducirDia(dia) {
  const map = { monday: 'Lunes', tuesday: 'Martes', wednesday: 'Miércoles', thursday: 'Jueves', friday: 'Viernes', saturday: 'Sábado', sunday: 'Domingo' };
  return map[dia] || dia;
}
