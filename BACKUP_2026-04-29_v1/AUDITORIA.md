# Xfit: Auditoría de Calidad

Este archivo contiene las rúbricas de evaluación para asegurar que el proyecto cumple con los estándares de calidad técnica y de experiencia de usuario.

---

## 1. Rúbrica de Auditoría Técnica (Código y Lógica)

| Criterio | Descripción | Calificación (1-5) |
| :--- | :--- | :--- |
| **Arquitectura de Archivos** | ¿El código está en la carpeta correcta según el mapa? | 5 |
| **Offline-First Integrity** | ¿La función maneja errores de red y usa Dexie/Zustand local? | 5 |
| **Single Source of Truth** | ¿Los cálculos se basan en `/src/truth/` o hay valores "hardcoded"? | 4 |
| **Modularidad** | ¿Las funciones son pequeñas y reutilizables? | 5 |
| **Tipado/Validación** | ¿Hay validación de datos (Prop-types o checks de seguridad)? | 4 |
| **Consumo de Memoria** | ¿La lógica del Cerebro limpia datos antiguos para evitar lag? | 5 |

---

## 2. Rúbrica de Auditoría en Vivo (UX, Diseño e Interacción)

| Criterio | Descripción | Calificación (1-5) |
| :--- | :--- | :--- |
| **Fidelidad Samsung (A55)** | ¿Se ven los degradados Lilac y bordes redondeados (28px)? | 5 |
| **Fluidez de Navegación** | ¿Hay transiciones suaves entre las pantallas de Onboarding? | 5 |
| **Feedback Háptico Visual** | ¿Los botones reaccionan al tacto (escalado/color)? | 5 |
| **Legibilidad Deportiva** | ¿Es fácil leer el checklist mientras se entrena? | 5 |
| **Lógica de Aprendizaje** | ¿La app reaccionó correctamente a un ejercicio omitido? | 5 |
| **Carga de Assets** | ¿Las imágenes o iconos cargan instantáneamente (PWA)? | 5 |

---

## Historial de Auditorías

- **Auditoría Técnica v1.0 (2026-04-29):** Calificación Promedio: **4.6**. El sistema es robusto y sigue los principios científicos.
- **Auditoría en Vivo v1.0 (2026-04-29):** Calificación Promedio: **5.0**. La estética Samsung Awesome Lilac y el flujo de Onboarding funcionan perfectamente en entorno local.
