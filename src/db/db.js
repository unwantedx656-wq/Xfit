/**
 * XFIT — Configuración de la Base de Datos (Dexie / IndexedDB)
 * Toda la persistencia de la app ocurre aquí. No hay backend.
 */
import Dexie from 'dexie';

const db = new Dexie('XfitDB');

db.version(1).stores({
  // Perfil de la usuaria (configuración del onboarding)
  userConfig: '++id, nombre, fechaNacimiento, objetivo, pesoActual, pesoMeta, talla, unidadPeso, unidadTalla, equipamiento, diasSemana, ejerciciosPorSesion, tiempoSesion, onboardingCompletado, creadoEn',

  // Sesiones de entrenamiento (historial)
  sesiones: '++id, rutinaId, fecha, diaSemana, horaInicio, horaFin, duracion, ejerciciosCompletados, ejerciciosTotales, ratioCompletado, modificaciones, ghostFails, creadoEn',

  // Rutinas generadas
  rutinas: '++id, nombre, objetivo, dias, semanas, split, ejerciciosPorDia, creadoEn, activa',

  // Metadatos de progresión (pesos y reps por ejercicio)
  progresion: '++id, sesionId, ejercicioId, ejercicioNombre, pesoUsado, repsRealizadas, setCompletado, timestamp',

  // Estado del cerebro (Perfil Maestro)
  brainState: '++id, version, lastUpdate, totalSessions, musclePriorities, energyMap, preferredMachines, ghostFailCount, strengthMilestones',

  // Medidas corporales (disparadas cada 12 sesiones)
  medidas: '++id, cintura, cadera, muslo, brazo, peso, sesionTrigger, creadoEn',
});

// ── Helpers ────────────────────────────────────────────────────

/** Guarda o actualiza la configuración del usuario */
export async function guardarConfig(config) {
  const existing = await db.userConfig.toCollection().first();
  if (existing) {
    await db.userConfig.update(existing.id, { ...config });
    return existing.id;
  }
  return await db.userConfig.add({ ...config, creadoEn: new Date().toISOString() });
}

/** Obtiene la configuración del usuario */
export async function obtenerConfig() {
  return await db.userConfig.toCollection().first();
}

/** Guarda una sesión completada */
export async function guardarSesion(sesion) {
  return await db.sesiones.add({ ...sesion, creadoEn: new Date().toISOString() });
}

/** Cuenta el total de sesiones */
export async function contarSesiones() {
  return await db.sesiones.count();
}

/** Obtiene las últimas N sesiones */
export async function obtenerUltimasSesiones(n = 12) {
  return await db.sesiones.orderBy('creadoEn').reverse().limit(n).toArray();
}

/** Guarda una rutina generada */
export async function guardarRutina(rutina) {
  // Desactivar rutina anterior
  await db.rutinas.where('activa').equals(1).modify({ activa: 0 });
  return await db.rutinas.add({ ...rutina, activa: 1, creadoEn: new Date().toISOString() });
}

/** Obtiene la rutina activa */
export async function obtenerRutinaActiva() {
  return await db.rutinas.where('activa').equals(1).first();
}

/** Guarda o actualiza el estado del cerebro */
export async function guardarBrainState(state) {
  const existing = await db.brainState.toCollection().first();
  if (existing) {
    await db.brainState.update(existing.id, { ...state, lastUpdate: new Date().toISOString() });
    return existing.id;
  }
  return await db.brainState.add({ ...state, lastUpdate: new Date().toISOString() });
}

/** Obtiene el estado del cerebro */
export async function obtenerBrainState() {
  return await db.brainState.toCollection().first();
}

/** Guarda medidas corporales */
export async function guardarMedidas(medidas) {
  return await db.medidas.add({ ...medidas, creadoEn: new Date().toISOString() });
}

/** Obtiene historial de medidas */
export async function obtenerMedidas() {
  return await db.medidas.orderBy('creadoEn').toArray();
}

/** Guarda progresión de un ejercicio */
export async function guardarProgresion(data) {
  return await db.progresion.add({ ...data, timestamp: new Date().toISOString() });
}

/** Obtiene historial de progresión de un ejercicio */
export async function obtenerProgresionEjercicio(ejercicioId) {
  return await db.progresion.where('ejercicioId').equals(ejercicioId).toArray();
}

export default db;
