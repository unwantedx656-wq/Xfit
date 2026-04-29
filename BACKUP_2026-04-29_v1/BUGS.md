# Xfit: Registro de Bugs

Este archivo documenta los errores encontrados durante las auditorías técnicas y en vivo.

| ID | Fecha | Descripción | Severidad | Estado |
| :--- | :--- | :--- | :--- | :--- |
| B001 | 2026-04-29 | Error de exportación `metadata` en `layout.js` por conflicto con `use client`. | Alta | ✅ Corregido |
| B002 | 2026-04-29 | Conflicto entre `next-pwa` y Turbopack en `next.config.mjs`. | Media | ✅ Corregido |
| B003 | 2026-04-29 | Import circular/dinámico de `ejercicios.js` en `generadorRutina.js` incompatible con ESM. | Alta | ✅ Corregido |
| B004 | 2026-04-29 | **Bug Visual Peso**: El Dashboard muestra pesos concatenados (ej: 180150lbs) en lugar de un valor único. | Baja | ❌ Pendiente |
| B005 | 2026-04-29 | **Flujo de Rutina**: El botón "Nueva" genera la rutina automáticamente sin pedir parámetros de días/ejercicios previos. | Alta | ❌ Pendiente |

---

## Instrucciones para el registro:
1. Describir el error de forma concisa.
2. Indicar si es un error de código (Técnico) o de experiencia (En vivo).
3. Clasificar severidad: Baja (Visual), Media (Funcionalidad menor), Alta (Bloqueante/Pérdida de datos).
