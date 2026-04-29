/**
 * XFIT — Generador de Rutinas (FITT-VP)
 * Genera rutinas personalizadas basadas en el perfil del usuario,
 * el equipamiento disponible y el estado actual del cerebro.
 */
import { TRAINING_LAWS, SPLIT_TEMPLATES } from '@/truth/reference';
import { filtrarPorEquipamiento, ejercicios as todosEjercicios } from '@/data/ejercicios';
import { getPrioridadMusculo, evaluarGhostFail } from '@/logic/brain/brainEngine';

// Músculos por tipo de split
const SPLIT_MUSCLES = {
  'Full Body A':   ['glutes', 'quads', 'back', 'chest', 'core'],
  'Full Body B':   ['glutes', 'hamstrings', 'back', 'shoulders', 'core'],
  'Lower':         ['glutes', 'quads', 'hamstrings', 'calves', 'core'],
  'Lower A':       ['glutes', 'quads', 'hamstrings', 'calves'],
  'Lower B':       ['glutes', 'quads', 'hamstrings', 'core'],
  'Upper':         ['back', 'chest', 'shoulders', 'biceps', 'triceps'],
  'Upper A':       ['back', 'chest', 'shoulders', 'biceps'],
  'Upper B':       ['back', 'shoulders', 'triceps', 'core'],
  'Push':          ['chest', 'shoulders', 'triceps'],
  'Pull':          ['back', 'biceps'],
  'Legs':          ['glutes', 'quads', 'hamstrings', 'calves'],
  'Active Rest':   ['core'],
};

/**
 * Genera una rutina completa para N días y N semanas.
 * @param {Object} config - Perfil del usuario.
 * @param {Object} brainState - Estado del cerebro.
 * @returns {Object} Rutina generada.
 */
export function generarRutina(config, brainState) {
  const {
    diasSemana = 3,
    ejerciciosPorSesion = 6,
    equipamiento = [],
    objetivo = 'recomp',
    semanas = 1,
    nombre = 'Mi Rutina',
  } = config;

  const splits = SPLIT_TEMPLATES[diasSemana] || SPLIT_TEMPLATES[3];
  const ejerciciosDisponibles = filtrarPorEquipamiento(equipamiento);

  // Generar cada día de entrenamiento
  const dias = splits.map((splitNombre, idx) => {
    const musculos = SPLIT_MUSCLES[splitNombre] || ['glutes', 'quads', 'back'];
    const ejerciciosDia = _seleccionarEjercicios(
      musculos,
      ejerciciosPorSesion,
      ejerciciosDisponibles,
      brainState,
      objetivo,
    );

    return {
      diaNum: idx + 1,
      nombre: splitNombre,
      musculos,
      ejercicios: ejerciciosDia,
    };
  });

  return {
    nombre,
    objetivo,
    diasSemana,
    semanas,
    split: Object.keys(SPLIT_TEMPLATES).find(k => k == diasSemana),
    diasPorSemana: dias,
    creadoEn: new Date().toISOString(),
    activa: 1,
  };
}

/**
 * Selecciona N ejercicios para una sesión dada.
 * Prioriza: 1) Compuestos, 2) Músculos con mayor prioridad del cerebro, 3) Sin ghost fail.
 */
function _seleccionarEjercicios(musculos, cantidad, ejerciciosDisponibles, brainState, objetivo) {
  const porMusculo = {};

  // Distribuir slots por músculo según prioridad del cerebro
  const prioridades = musculos.map(m => ({
    musculo: m,
    prioridad: getPrioridadMusculo(m, brainState),
  }));
  const totalPrioridad = prioridades.reduce((s, p) => s + p.prioridad, 0);

  // Asignar al menos 1 ejercicio por músculo, distribuir el resto proporcionalmente
  const slots = {};
  let asignados = 0;
  for (const { musculo, prioridad } of prioridades) {
    const base = Math.max(1, Math.floor((prioridad / totalPrioridad) * cantidad));
    slots[musculo] = base;
    asignados += base;
  }
  // Ajustar si hay diferencia
  const diff = cantidad - asignados;
  if (diff > 0) {
    const musculoAlta = prioridades.sort((a, b) => b.prioridad - a.prioridad)[0]?.musculo;
    if (musculoAlta) slots[musculoAlta] = (slots[musculoAlta] || 1) + diff;
  }

  // Seleccionar ejercicios por cada músculo
  const resultado = [];
  for (const musculo of musculos) {
    const cuota = slots[musculo] || 1;
    const candidatos = ejerciciosDisponibles
      .filter(e => e.musculoPrimario === musculo)
      .filter(e => {
        const gf = evaluarGhostFail(e.id, brainState);
        return gf !== 'reemplazar'; // Excluir si debe ser reemplazado
      })
      .sort((a, b) => {
        // Compuestos primero
        const tipoOrder = { compound: 0, isolation: 1, accessory: 2 };
        return (tipoOrder[a.tipo] || 1) - (tipoOrder[b.tipo] || 1);
      });

    // Tomar hasta 'cuota' ejercicios sin repetir
    const seleccionados = candidatos.slice(0, cuota);

    // Asignar parámetros según objetivo
    for (const ej of seleccionados) {
      resultado.push({
        ...ej,
        ...(_parametrosPorObjetivo(ej, objetivo)),
      });
    }
  }

  return resultado.slice(0, cantidad);
}

/**
 * Determina sets/reps/descanso según objetivo.
 */
function _parametrosPorObjetivo(ejercicio, objetivo) {
  const intensidad = TRAINING_LAWS.INTENSITY;
  const descansos = TRAINING_LAWS.REST_PERIODS;

  let setsBase, repsBase, descansoSegundos;

  if (objetivo === 'strength') {
    setsBase = intensidad.STRENGTH_BASE.sets;
    repsBase = intensidad.STRENGTH_BASE.reps;
  } else if (objetivo === 'recomp') {
    // Recomposición: mix de hipertrofia y metabólico
    setsBase = intensidad.HYPERTROPHY.sets;
    repsBase = ejercicio.tipo === 'compound'
      ? intensidad.HYPERTROPHY.reps
      : intensidad.METABOLIC.reps;
  } else {
    // maintenance
    setsBase = intensidad.HYPERTROPHY.sets;
    repsBase = intensidad.HYPERTROPHY.reps;
  }

  descansoSegundos = descansos[ejercicio.descanso] || descansos.ISOLATION;

  return { setsBase, repsBase, descansoSegundos, pesoBase: null };
}

/**
 * Sugiere un ejercicio alternativo para el mismo músculo.
 * @param {string} ejercicioActualId - ID del ejercicio a reemplazar.
 * @param {string[]} equipamiento - Equipamiento disponible.
 * @param {string[]} idsEnSesion - IDs de ejercicios ya en la sesión.
 * @returns {Object|null} Ejercicio alternativo o null.
 */
export function sugerirAlternativa(ejercicioActualId, equipamiento, idsEnSesion = []) {
  const actual = todosEjercicios.find(e => e.id === ejercicioActualId);
  if (!actual) return null;

  const candidatos = filtrarPorEquipamiento(equipamiento)
    .filter(e =>
      e.id !== ejercicioActualId &&
      e.musculoPrimario === actual.musculoPrimario &&
      !idsEnSesion.includes(e.id)
    );

  return candidatos[0] || null;
}
