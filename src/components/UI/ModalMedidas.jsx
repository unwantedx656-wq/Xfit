'use client';

import { useState } from 'react';
import { guardarMedidas, obtenerConfig } from '@/db/db';
import { useAppStore } from '@/store/useStore';

const CAMPOS = [
  { id: 'cintura', label: 'Cintura', emoji: '👗' },
  { id: 'cadera',  label: 'Cadera',  emoji: '🍑' },
  { id: 'muslo',   label: 'Muslo',   emoji: '🦵' },
  { id: 'brazo',   label: 'Brazo',   emoji: '💪' },
];

export default function ModalMedidas() {
  const { perfil, brainState, setMostrarModalMedidas, mostrarToast } = useAppStore();
  const unidad = perfil?.unidadTalla || 'in';
  const [valores, setValores] = useState({ cintura: '', cadera: '', muslo: '', brazo: '', peso: '' });

  const handleGuardar = async () => {
    try {
      await guardarMedidas({
        ...valores,
        sesionTrigger: brainState?.totalSessions || 0,
      });
      mostrarToast('¡Medidas guardadas! 📏', 'success');
      setMostrarModalMedidas(false);
    } catch (err) {
      console.error(err);
      mostrarToast('Error guardando medidas', 'error');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-sheet" style={{ maxHeight: '85dvh', overflowY: 'auto' }}>
        <div className="modal-handle" />
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <p style={{ fontSize: '2.5rem' }}>🎯</p>
          <h3 className="text-title gradient-text mt-sm">¡Momento de medirse!</h3>
          <p className="text-body mt-sm">
            Completaste un ciclo de entrenamiento. Tus medidas mostrarán el progreso real.
          </p>
        </div>

        <div className="flex flex-col gap-md">
          {CAMPOS.map(c => (
            <div key={c.id} className="input-wrapper">
              <label className="input-label">{c.emoji} {c.label} ({unidad})</label>
              <input
                id={`medida-${c.id}`}
                className="input-field"
                type="number"
                placeholder={`Tu ${c.label.toLowerCase()} en ${unidad}`}
                value={valores[c.id]}
                onChange={e => setValores(p => ({ ...p, [c.id]: e.target.value }))}
                inputMode="decimal"
              />
            </div>
          ))}
          <div className="input-wrapper">
            <label className="input-label">⚖️ Peso actual ({perfil?.unidadPeso || 'lbs'})</label>
            <input
              id="medida-peso"
              className="input-field"
              type="number"
              placeholder="Tu peso de hoy"
              value={valores.peso}
              onChange={e => setValores(p => ({ ...p, peso: e.target.value }))}
              inputMode="decimal"
            />
          </div>
        </div>

        <button id="guardar-medidas-btn" className="btn btn-primary mt-lg" onClick={handleGuardar}>
          Guardar medidas 📏
        </button>
        <button className="btn btn-ghost mt-sm" onClick={() => setMostrarModalMedidas(false)}>
          Ahora no
        </button>
      </div>
    </div>
  );
}
