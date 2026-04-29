# Xfit: Especificaciones Técnicas y Sistema de Diseño

## 1. Stack Tecnológico (Offline-First)

Para garantizar que la app funcione sin internet en el gimnasio y sea rápida en un Samsung A55:

- **Framework:** Next.js 14+ (App Router) para una estructura robusta.
- **Persistencia de Datos:** Dexie.js (IndexedDB). Manejará el "Cerebro" y el historial de forma local.
- **Estado Global:** Zustand. Ligero y persistente (con middleware para localStorage).
- **PWA:** `next-pwa` con Service Workers configurados para caching agresivo de assets.
- **Estilos:** Vanilla CSS con Variables (CSS Custom Properties). No usaremos frameworks como Tailwind para tener control total sobre los degradados y efectos de vidrio (Glassmorphism).

---

## 2. Sistema de Diseño: "Samsung Awesome Lilac"

Inspirado en la estética del Samsung Galaxy A55 y One UI 6.1.

### 2.1 Paleta de Colores (Samsung Palette)
- **Primary (Awesome Lilac):** `#D1B3FF` (Lila suave).
- **Secondary (Deep Purple):** `#6200EE` (Morado Samsung para acciones principales).
- **Accent (Rose):** `#FFB3D9` (Rosado suave para hitos y logros).
- **Background (Dark Mode):** `#0F0F12` (Gris casi negro, típico de pantallas AMOLED).
- **Surface (Card):** `rgba(255, 255, 255, 0.05)` con `backdrop-filter: blur(10px)`.

### 2.2 Tipografía
- **Font-Family:** 'Inter', sans-serif (Lo más cercano a Samsung Sharp Sans que es legible en web).
- **Hierarchy:** Títulos grandes, redondeados y con mucho "aire" (espaciado).

### 2.3 UI Elements (One UI Style)
- **Bordes:** `border-radius: 28px;` (Bordes muy redondeados para tarjetas y botones).
- **Interacción:** Feedback háptico visual (escalado suave al presionar: `scale(0.98)`).
- **Micro-interacciones:** Degradados que se mueven sutilmente al hacer scroll.

---

## 3. Mapeo de Tecnologías por Función

| Función | Tecnología | Implementación |
| :--- | :--- | :--- |
| Onboarding | React Hook Form | Validación de lbs, pulgadas y fechas. |
| Generador de Rutinas | Custom Logic (FITT-VP) | Algoritmo puro en JS para máxima velocidad. |
| Checklist de Sesión | Zustand Store | Estado efímero de la sesión actual. |
| Cerebro (Aprendizaje) | IndexedDB + Logic | Comparación de batches de 12 sesiones. |
| Notificaciones | Browser Push API | Recordatorios de hidratación o medidas. |

---

## 4. Notas de UX para la Usuaria
- **Bottom Navigation:** Menú principal abajo para fácil acceso con una sola mano (Filosofía One UI).
- **Haptic Design:** Los botones deben "sentirse" pesados y premium.
- **Sin Scroll innecesario:** Uso de Tabs y Steppers para procesos largos como el Onboarding.
