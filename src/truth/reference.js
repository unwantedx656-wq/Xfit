/**
 * XFIT — SOURCE OF TRUTH (reference.js)
 * Todas las constantes científicas que rigen la lógica de la app.
 * NINGÚN componente o función inventa valores: todo se importa de aquí.
 */

// ── Leyes de Entrenamiento (FITT-VP) ────────────────────────
export const TRAINING_LAWS = {
  VOLUME: {
    MAINTENANCE: { min: 6,  max: 10 },
    OPTIMAL:     { min: 12, max: 20 },
    LIMIT: 25,
  },
  INTENSITY: {
    STRENGTH_BASE: { reps: [6, 8],   rpe: 9, sets: 4 },
    HYPERTROPHY:   { reps: [10, 15], rpe: 8, sets: 3 },
    METABOLIC:     { reps: [15, 20], rpe: 7, sets: 3 },
  },
  REST_PERIODS: {
    COMPOUND:  180,
    ISOLATION: 120,
    ACCESSORY:  60,
  },
  DELOAD_TRIGGER_SESSIONS: 2,
  DELOAD_VOLUME_REDUCTION: 0.5,
};

// ── Metabolismo y Unidades ───────────────────────────────────
export const METABOLIC_TRUTH = {
  UNITS: { WEIGHT: 'lbs', HEIGHT: 'in' },
  CONVERSIONS: {
    LBS_TO_KG: 0.453592,
    KG_TO_LBS: 2.20462,
    IN_TO_CM:  2.54,
    CM_TO_IN:  0.393701,
  },
  HEALTH_MARKERS: {
    WAIST_HEIGHT_RATIO_GOAL: 0.5,
  },
  RECOMP_DEFICIT_KCAL: -250,
};

// ── Recuperación por grupo muscular ─────────────────────────
export const RECOVERY_LAWS = {
  HOURS_BY_MUSCLE_SIZE: {
    SMALL:  24,   // Bíceps, Tríceps, Deltoides
    MEDIUM: 48,   // Pecho, Dorsales, Hombros
    LARGE:  72,   // Cuádriceps, Glúteos, Isquios
  },
};

// ── Splits por días de entrenamiento ────────────────────────
export const SPLIT_TEMPLATES = {
  2: ['Full Body A', 'Full Body B'],
  3: ['Lower', 'Upper', 'Full Body'],
  4: ['Lower A', 'Upper A', 'Lower B', 'Upper B'],
  5: ['Push', 'Pull', 'Legs', 'Upper', 'Lower'],
  6: ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs'],
  7: ['Push', 'Pull', 'Legs', 'Upper', 'Lower', 'Push', 'Active Rest'],
};

// ── Cerebro / Batch Logic ────────────────────────────────────
export const BATCH_LOGIC = {
  SESSIONS_PER_BATCH:   12,
  WEIGHT_NEW_DATA:      0.30,  // 30% nueva data
  WEIGHT_MASTER:        0.70,  // 70% perfil maestro
  GHOST_FAIL_THRESHOLD: 2,     // Veces que puede fallar antes de marcar ejercicio
  GHOST_FAIL_REPLACE:   3,     // Veces que falla para sugerir reemplazo
};

// ── Objetivos de usuario ─────────────────────────────────────
export const USER_GOALS = {
  RECOMP:       { id: 'recomp',       label: 'Perder grasa y tonificarme',     icon: '🔥' },
  STRENGTH:     { id: 'strength',     label: 'Ganar fuerza y músculo',         icon: '💪' },
  MAINTENANCE:  { id: 'maintenance',  label: 'Mantener mi ritmo actual',       icon: '⚖️' },
};

// ── Equipamiento disponible ──────────────────────────────────
export const EQUIPMENT_LIST = [
  { id: 'leg_press',        label: 'Prensa de Piernas',       emoji: '🦵', category: 'machine' },
  { id: 'smith_machine',    label: 'Máquina Smith',           emoji: '🏋️', category: 'machine' },
  { id: 'cable_machine',    label: 'Poleas / Cables',         emoji: '🔗', category: 'machine' },
  { id: 'leg_extension',    label: 'Leg Extension',           emoji: '🦿', category: 'machine' },
  { id: 'leg_curl',         label: 'Leg Curl (Femoral)',      emoji: '🦵', category: 'machine' },
  { id: 'hack_squat',       label: 'Hack Squat',              emoji: '⬆️', category: 'machine' },
  { id: 'hip_thrust_machine',label: 'Hip Thrust Machine',    emoji: '🍑', category: 'machine' },
  { id: 'lat_pulldown',     label: 'Jalón al Pecho',          emoji: '⬇️', category: 'machine' },
  { id: 'seated_row',       label: 'Remo en Polea Baja',      emoji: '🚣', category: 'machine' },
  { id: 'chest_press_machine', label: 'Press de Pecho (Máq)', emoji: '🫁', category: 'machine' },
  { id: 'shoulder_press_machine', label: 'Press de Hombros',  emoji: '💫', category: 'machine' },
  { id: 'pec_deck',         label: 'Pec Deck (Mariposa)',     emoji: '🦋', category: 'machine' },
  { id: 'calf_raise_machine', label: 'Gemelos (Máquina)',     emoji: '👟', category: 'machine' },
  { id: 'dumbbells',        label: 'Mancuernas',              emoji: '🏋️', category: 'free' },
  { id: 'barbell',          label: 'Barra Libre',             emoji: '🏋️', category: 'free' },
  { id: 'resistance_bands', label: 'Bandas Elásticas',        emoji: '🎀', category: 'accessory' },
  { id: 'mat',              label: 'Colchoneta / Mat',        emoji: '🧘', category: 'accessory' },
  { id: 'pull_up_bar',      label: 'Barra de Dominadas',      emoji: '🏅', category: 'machine' },
];

// ── Grupos musculares ────────────────────────────────────────
export const MUSCLE_GROUPS = {
  GLUTES:    { id: 'glutes',    label: 'Glúteos',    size: 'LARGE',  priority: 1 },
  QUADS:     { id: 'quads',     label: 'Cuádriceps', size: 'LARGE',  priority: 2 },
  HAMSTRINGS:{ id: 'hamstrings',label: 'Femorales',  size: 'LARGE',  priority: 3 },
  BACK:      { id: 'back',      label: 'Espalda',    size: 'MEDIUM', priority: 4 },
  CHEST:     { id: 'chest',     label: 'Pecho',      size: 'MEDIUM', priority: 5 },
  SHOULDERS: { id: 'shoulders', label: 'Hombros',    size: 'MEDIUM', priority: 6 },
  BICEPS:    { id: 'biceps',    label: 'Bíceps',     size: 'SMALL',  priority: 7 },
  TRICEPS:   { id: 'triceps',   label: 'Tríceps',    size: 'SMALL',  priority: 8 },
  CALVES:    { id: 'calves',    label: 'Gemelos',    size: 'SMALL',  priority: 9 },
  CORE:      { id: 'core',      label: 'Core/Abs',   size: 'SMALL',  priority: 10 },
};
