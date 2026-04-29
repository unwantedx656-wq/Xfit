# Xfit: Lógica del Cerebro (Learning Engine)

Este documento detalla el funcionamiento del algoritmo de aprendizaje adaptativo de Xfit.

## 1. El Ciclo de Datos (The Loop)

El sistema funciona en ciclos de **12 sesiones** (una "Tanda").

### Fase A: Recolección (Sesión 1 a 11)
- Cada sesión genera un objeto JSON de metadatos.
- Se almacenan en `LocalDataStore` (Dexie).
- **Datos capturados:**
  - Ejercicios omitidos (Ghost Fail).
  - Pesos aumentados manualmente.
  - Tiempo total de la sesión.
  - Hora del día del entrenamiento.

### Fase B: Análisis de Tanda (Sesión 12)
Al completar la sesión 12, se dispara un proceso de fondo:
1. **Extracción de Patrones:** ¿Qué ejercicios se editaron más? ¿En qué día hubo más fuerza?
2. **Generación de "Snapshot":** Un resumen estadístico de la tanda (ej: "Incremento de fuerza en empuje: 5%").

### Fase C: Comparación y Fusión (The Merge)
Aquí es donde ocurre la inteligencia real para evitar archivos pesados:
1. El sistema toma el **Perfil Maestro** actual.
2. Toma el **Snapshot** de la nueva tanda.
3. **Ponderación:** El Perfil Maestro pesa un 70% y la nueva data un 30% (esto da estabilidad al cerebro).
4. **Actualización:** El resultado sobreescribe el Perfil Maestro.
5. **Purga:** Se eliminan los metadatos crudos de las 12 sesiones anteriores para liberar espacio.

---

## 2. Variables de Aprendizaje (Insights)

El cerebro debe "entender" estos 3 pilares:

### 2.1 Preferencia de Equipamiento
- Si la usuaria cambia repetidamente un ejercicio de "Prensa" por "Sentadilla Smith", el cerebro marca la Smith como **Prioridad Alta** para ese grupo muscular.

### 2.2 Capacidad de Trabajo (Work Capacity)
- Si detecta que después del ejercicio #5 la velocidad de completado baja drásticamente, el cerebro sugerirá en la próxima rutina: *"He notado que te cansas al final, ¿quieres mover los ejercicios más pesados al principio?"*.

### 2.3 Curva de Fuerza Semanal
- Detecta si los lunes rinde más que los viernes. Ajustará los ejercicios más demandantes (compuestos) al día de mayor energía detectado.

---

## 3. Comportamiento ante el Error (Ghost Fail)

- **Evento:** Ejercicio no marcado como completado.
- **Acción 1 (Primera vez):** Ignorar (puede ser un evento aislado).
- **Acción 2 (Segunda vez consecutiva):** Marcar como "Potencialmente Inadecuado".
- **Acción 3 (Tercera vez):** En la generación de la siguiente rutina, el sistema presentará una opción de "Reemplazo Sugerido" basada en la ciencia pero con menor volumen.

---

## 4. Persistencia (Single Truth File)

El estado final del cerebro se guarda en un solo objeto: `user_brain_state.json`.

```json
{
  "version": 1.2,
  "lastUpdate": "2026-04-29",
  "totalSessions": 48,
  "musclePriorities": { "glutes": 1.2, "quads": 0.8 },
  "energyMap": { "monday": "high", "friday": "low" },
  "preferredMachines": ["smith_machine", "leg_press_horizontal"],
  "strengthMilestones": { "press": "120lbs" }
}
```
