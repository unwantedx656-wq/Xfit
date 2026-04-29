/**
 * XFIT — Motor del Cerebro (Brain Engine)
 * Gestiona el aprendizaje adaptativo basado en batches de 12 sesiones.
 * Implementa: Ghost Fail, Merge de perfiles, Energy Map, preferencias.
 */
import { BATCH_LOGIC, RECOVERY_LAWS } from '@/truth/reference';
import {
  guardarBrainState,
  obtenerBrainState,
  obtenerUltimasSesiones,
  contarSesiones,
} from '@/db/db';

// ── Estado inicial del cerebro ───────────────────────────────
export const BRAIN_STATE_INICIAL = {
  version: 1,
  totalSessions: 0,
  musclePriorities: {
    glutes: 1.0, quads: 1.0, hamstrings: 1.0,
    back: 1.0, chest: 1.0, shoulders: 1.0,
    biceps: 0.8, triceps: 0.8, calves: 0.7, core: 1.0,
  },
  energyMap: {
    monday: 'neutral', tuesday: 'neutral', wednesday: 'neutral',
    thursday: 'neutral', friday: 'neutral', saturday: 'neutral', sunday: 'neutral',
  },
  preferredMachines: [],
  ghostFailCount: {},      // { ejercicioId: nVeces }
  ghostFailConsecutivo: 0,
  strengthMilestones: {},  // { ejercicioId: { peso, fecha } }
};

/**
 * Inicializa o recupera el estado del cerebro desde Dexie.
 */
export async function inicializarCerebro() {
  let state = await obtenerBrainState();
  if (!state) {
    state = { ...BRAIN_STATE_INICIAL };
    await guardarBrainState(state);
  }
  return state;
}

/**
 * Procesa una sesión terminada y dispara el análisis si se completó un batch.
 * @param {Object} sesionData - Datos de la sesión terminada.
 * @param {Object} brainState - Estado actual del cerebro.
 * @returns {Object} Nuevo estado del cerebro.
 */
export async function procesarSesion(sesionData, brainState) {
  const totalSesiones = await contarSesiones();
  let nuevoState = { ...brainState, totalSessions: totalSesiones };

  // 1. Actualizar Ghost Fail count
  const ghostFailCount = { ...(nuevoState.ghostFailCount || {}) };
  for (const ejercicioId of (sesionData.ghostFails || [])) {
    ghostFailCount[ejercicioId] = (ghostFailCount[ejercicioId] || 0) + 1;
  }
  nuevoState.ghostFailCount = ghostFailCount;

  // 2. Actualizar Energy Map según el día y el ratio de completado
  const dayKey = _diaEnIngles(sesionData.diaSemana);
  if (dayKey && sesionData.ratioCompletado !== undefined) {
    const energyMap = { ...(nuevoState.energyMap || {}) };
    const energyActual = energyMap[dayKey] || 'neutral';
    energyMap[dayKey] = _calcularEnergia(energyActual, sesionData.ratioCompletado);
    nuevoState.energyMap = energyMap;
  }

  // 3. Actualizar máquinas preferidas desde modificaciones
  const preferredMachines = [...(nuevoState.preferredMachines || [])];
  for (const mod of (sesionData.modificaciones || [])) {
    if (mod.tipo === 'reemplazo' && mod.nuevoId && !preferredMachines.includes(mod.nuevoId)) {
      preferredMachines.push(mod.nuevoId);
    }
  }
  nuevoState.preferredMachines = preferredMachines;

  // 4. Actualizar prioridades musculares
  nuevoState = _actualizarPrioridadesMusculares(nuevoState, sesionData);

  // 5. ¿Es momento del Batch Analysis? (cada 12 sesiones)
  if (totalSesiones > 0 && totalSesiones % BATCH_LOGIC.SESSIONS_PER_BATCH === 0) {
    nuevoState = await _ejecutarBatchAnalysis(nuevoState);
  }

  // 6. Detectar deload: 2 sesiones con ratio < 0.5
  nuevoState = _evaluarDeload(nuevoState, sesionData);

  await guardarBrainState(nuevoState);
  return nuevoState;
}

/**
 * Evalúa si un ejercicio debe ser reemplazado por Ghost Fail repetido.
 * @param {string} ejercicioId
 * @param {Object} brainState
 * @returns {'ok'|'alerta'|'reemplazar'}
 */
export function evaluarGhostFail(ejercicioId, brainState) {
  const count = brainState?.ghostFailCount?.[ejercicioId] || 0;
  if (count >= BATCH_LOGIC.GHOST_FAIL_REPLACE) return 'reemplazar';
  if (count >= BATCH_LOGIC.GHOST_FAIL_THRESHOLD) return 'alerta';
  return 'ok';
}

/**
 * Retorna el multiplicador de prioridad de un músculo según el cerebro.
 * @param {string} musculoId
 * @param {Object} brainState
 * @returns {number}
 */
export function getPrioridadMusculo(musculoId, brainState) {
  return brainState?.musclePriorities?.[musculoId] ?? 1.0;
}

/**
 * Retorna el día de la semana con mayor energía según el cerebro.
 * @param {Object} brainState
 * @returns {string} Día en español
 */
export function getDiaMasEnergetico(brainState) {
  const map = brainState?.energyMap || {};
  const niveles = { high: 3, neutral: 2, low: 1 };
  let mejorDia = 'monday';
  let mejorNivel = 0;
  for (const [dia, nivel] of Object.entries(map)) {
    const n = niveles[nivel] || 2;
    if (n > mejorNivel) { mejorNivel = n; mejorDia = dia; }
  }
  return mejorDia;
}

// ── Private helpers ─────────────────────────────────────────

async function _ejecutarBatchAnalysis(state) {
  const sesiones = await obtenerUltimasSesiones(BATCH_LOGIC.SESSIONS_PER_BATCH);

  // Calcular snapshot de la tanda
  const snapshot = _generarSnapshot(sesiones);

  // Merge: 70% perfil maestro + 30% nueva data
  const w0 = BATCH_LOGIC.WEIGHT_MASTER;
  const w1 = BATCH_LOGIC.WEIGHT_NEW_DATA;

  const musclePriorities = {};
  for (const key of Object.keys(state.musclePriorities)) {
    const actual = state.musclePriorities[key] || 1.0;
    const nuevo  = snapshot.musclePriorities[key] || 1.0;
    musclePriorities[key] = parseFloat((actual * w0 + nuevo * w1).toFixed(3));
  }

  // Limpiar ghost fails que ya se corrigieron (count < 1)
  const ghostFailCount = {};
  for (const [k, v] of Object.entries(state.ghostFailCount || {})) {
    if (v > 0) ghostFailCount[k] = Math.max(0, v - 1); // Decay
  }

  return { ...state, musclePriorities, ghostFailCount, lastBatchAt: new Date().toISOString() };
}

function _generarSnapshot(sesiones) {
  const musclePriorities = {};
  for (const sesion of sesiones) {
    if (sesion.ratioCompletado > 0.8) {
      // Si completó bien la sesión, esos músculos tienen prioridad alta
      // (esto es una aproximación; en producción se vincularía con el ejercicio)
    }
  }
  // Snapshot base (se refina con más data)
  return { musclePriorities: { glutes: 1.2, quads: 1.0, hamstrings: 1.0 } };
}

function _actualizarPrioridadesMusculares(state, sesionData) {
  const prioridades = { ...(state.musclePriorities || {}) };
  // Si agregó un ejercicio manualmente, subir prioridad del músculo
  for (const mod of (sesionData.modificaciones || [])) {
    if (mod.tipo === 'agregado') {
      // No tenemos el músculo directamente, se actualizará en batch
    }
  }
  return { ...state, musclePriorities: prioridades };
}

function _evaluarDeload(state, sesionData) {
  let consecutivos = state.ghostFailConsecutivo || 0;
  if (sesionData.ratioCompletado < 0.5) {
    consecutivos += 1;
  } else {
    consecutivos = 0;
  }
  const necesitaDeload = consecutivos >= BATCH_LOGIC.GHOST_FAIL_THRESHOLD;
  return { ...state, ghostFailConsecutivo: consecutivos, necesitaDeload };
}

function _calcularEnergia(actual, ratio) {
  if (ratio >= 0.85) return 'high';
  if (ratio >= 0.6)  return 'neutral';
  return 'low';
}

function _diaEnIngles(diaEspanol) {
  const map = {
    'lunes': 'monday', 'martes': 'tuesday', 'miércoles': 'wednesday',
    'jueves': 'thursday', 'viernes': 'friday', 'sábado': 'saturday', 'domingo': 'sunday',
  };
  return map[diaEspanol?.toLowerCase()] || null;
}
