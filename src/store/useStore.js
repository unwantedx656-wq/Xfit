/**
 * XFIT — Store Global (Zustand)
 * Estado en memoria para la sesión activa y navegación.
 */
import { create } from 'zustand';

// ── Store de la App ─────────────────────────────────────────
export const useAppStore = create((set, get) => ({
  // Navegación
  vistaActual: 'home',
  setVista: (vista) => set({ vistaActual: vista }),

  // Perfil del usuario (cargado desde Dexie al iniciar)
  perfil: null,
  setPerfil: (perfil) => set({ perfil }),

  // Rutina activa
  rutinaActiva: null,
  setRutinaActiva: (rutina) => set({ rutinaActiva: rutina }),

  // Estado del cerebro (brain state)
  brainState: null,
  setBrainState: (state) => set({ brainState: state }),

  // Toast/notificaciones
  toast: null,
  mostrarToast: (mensaje, tipo = 'info', duracion = 3000) => {
    set({ toast: { mensaje, tipo } });
    setTimeout(() => set({ toast: null }), duracion);
  },

  // Modal de medidas (trigger cada 12 sesiones)
  mostrarModalMedidas: false,
  setMostrarModalMedidas: (val) => set({ mostrarModalMedidas: val }),

  // Inicializado
  appLista: false,
  setAppLista: (val) => set({ appLista: val }),
}));

// ── Store de la Sesión de Entrenamiento ─────────────────────
export const useSesionStore = create((set, get) => ({
  // Sesión activa
  sesionActiva: null,
  ejerciciosActivos: [],       // Ejercicios del día con estado completado/peso/reps
  sesionIniciada: false,
  horaInicio: null,
  modificaciones: [],          // Log de cambios manuales (para el cerebro)

  iniciarSesion: (diaRutina) => {
    const ejerciciosConEstado = diaRutina.ejercicios.map(ej => ({
      ...ej,
      completado: false,
      pesoActual: ej.pesoBase || null,
      repsActuales: ej.repsBase ? ej.repsBase[1] : 12,
      setsActuales: ej.setsBase || 3,
      modificadoManualmente: false,
    }));
    set({
      sesionActiva: diaRutina,
      ejerciciosActivos: ejerciciosConEstado,
      sesionIniciada: true,
      horaInicio: new Date().toISOString(),
      modificaciones: [],
    });
  },

  marcarEjercicioCompletado: (ejercicioId) => {
    set(state => ({
      ejerciciosActivos: state.ejerciciosActivos.map(ej =>
        ej.id === ejercicioId ? { ...ej, completado: !ej.completado } : ej
      ),
    }));
  },

  actualizarEjercicio: (ejercicioId, cambios) => {
    const timestamp = new Date().toISOString();
    set(state => ({
      ejerciciosActivos: state.ejerciciosActivos.map(ej =>
        ej.id === ejercicioId ? { ...ej, ...cambios, modificadoManualmente: true } : ej
      ),
      modificaciones: [
        ...state.modificaciones,
        { ejercicioId, cambios, timestamp },
      ],
    }));
  },

  reemplazarEjercicio: (ejercicioId, nuevoEjercicio) => {
    const timestamp = new Date().toISOString();
    set(state => ({
      ejerciciosActivos: state.ejerciciosActivos.map(ej =>
        ej.id === ejercicioId
          ? { ...nuevoEjercicio, completado: false, pesoActual: null, modificadoManualmente: true }
          : ej
      ),
      modificaciones: [
        ...state.modificaciones,
        { ejercicioId, tipo: 'reemplazo', nuevoId: nuevoEjercicio.id, timestamp },
      ],
    }));
  },

  agregarEjercicio: (ejercicio) => {
    const timestamp = new Date().toISOString();
    set(state => ({
      ejerciciosActivos: [
        ...state.ejerciciosActivos,
        { ...ejercicio, completado: false, pesoActual: null, modificadoManualmente: true },
      ],
      modificaciones: [
        ...state.modificaciones,
        { tipo: 'agregado', ejercicioId: ejercicio.id, timestamp },
      ],
    }));
  },

  finalizarSesion: () => {
    const state = get();
    const completados = state.ejerciciosActivos.filter(e => e.completado).length;
    const total = state.ejerciciosActivos.length;
    const ghostFails = state.ejerciciosActivos
      .filter(e => !e.completado)
      .map(e => e.id);
    const horaFin = new Date().toISOString();
    const duracion = horaFin && state.horaInicio
      ? Math.round((new Date(horaFin) - new Date(state.horaInicio)) / 60000)
      : 0;

    return {
      fecha: new Date().toISOString().split('T')[0],
      diaSemana: new Date().toLocaleString('es-SV', { weekday: 'long' }),
      horaInicio: state.horaInicio,
      horaFin,
      duracion,
      ejerciciosCompletados: completados,
      ejerciciosTotales: total,
      ratioCompletado: total > 0 ? completados / total : 0,
      modificaciones: state.modificaciones,
      ghostFails,
    };
  },

  resetSesion: () => set({
    sesionActiva: null,
    ejerciciosActivos: [],
    sesionIniciada: false,
    horaInicio: null,
    modificaciones: [],
  }),
}));
