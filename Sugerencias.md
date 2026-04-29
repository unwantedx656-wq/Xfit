# Xfit: Banco de Sugerencias y Mejoras

Espacio para ideas post-auditoría sobre cómo elevar la calidad del proyecto.

## Ideas de UI/UX
- [ ] Explorar animaciones Lottie para las celebraciones de récords personales.
- [ ] Implementar un modo de "Entrenamiento Rápido" si el cerebro detecta poco tiempo disponible.
- [ ] **Indicator de Deload**: Mostrar alerta visual en el Dashboard cuando el Cerebro detecte fatiga acumulada (ratio < 0.5).
- [ ] **Rediseño Checklist**: Sustituir la lista simple por tarjetas de ejercicio más grandes, tipo "Workout Cards", donde los sets y pesos sean el foco visual principal (superar estética de Excel).
- [ ] **Edición Externa**: Permitir editar la rutina desde la vista de "Entrenar" sin tener que iniciar la sesión obligatoriamente.

## Ideas de Naming (Copy)
- [ ] **Sistema de Adaptación**: Cambiar "Tu Cerebro" por "Algoritmo Adaptativo", "Tu Inteligencia Xfit" o "Personalización".
- [ ] **Insights**: Cambiar "Lo que aprendió tu cerebro" por "Análisis de Progresión" o "Tu Evolución".

## Ideas Técnicas
- [ ] Usar Web Workers para el procesamiento de los Batches de 12 sesiones y no bloquear el hilo principal.
- [ ] Sincronización en segundo plano cuando se detecte WiFi (PWA Background Sync).
- [ ] **Centralización**: Mover `SPLIT_MUSCLES` de `generadorRutina.js` a `src/truth/reference.js`.
- [ ] **Backup**: Sistema de exportación/importación de JSON para los datos de Dexie (Seguridad de datos).
- [ ] **Memoización**: Usar `React.memo` en componentes de la lista de ejercicios para optimizar re-renders.

---

## Notas de Auditoría (2026-04-29)
- La arquitectura es sólida pero se recomienda mover las definiciones de splits a la "Fuente de la Verdad" para evitar lógica dispersa.
- Se detectó que el cierre inesperado de la pestaña podría causar pérdida de la sesión activa; considerar guardar el estado de `useSesionStore` en `localStorage` (persist de Zustand).
