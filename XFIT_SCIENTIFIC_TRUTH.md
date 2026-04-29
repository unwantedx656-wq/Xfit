# Xfit: Fuente de la Verdad (Scientific Reference)

Este archivo define las constantes biológicas y las leyes de entrenamiento que rigen la lógica de la aplicación.

## 1. Leyes de Entrenamiento (FITT-VP Adaptado)

### 1.1 Volumen de Entrenamiento (Series por Semana)
Para una usuaria experimentada buscando recomposición:
- **Mantenimiento:** 6-10 series por grupo muscular/semana.
- **Ganancia/Mejora:** 12-20 series por grupo muscular/semana.
- **Límite de Fatiga:** >25 series (El sistema debe alertar si se excede esto).

### 1.2 Intensidad y Repeticiones
- **Fuerza Base (Máquinas):** 6-8 reps (RPE 8-9).
- **Hipertrofia/Densidad:** 10-15 reps (RPE 7-8).
- **Resistencia/Bombeo:** 15-20 reps (RPE 6-7).

### 1.3 Tiempos de Descanso (Automáticos)
- **Compuestos (Prensa, Sentadilla Smith):** 2.5 - 3 minutos.
- **Aislamiento (Leg Extension, Poleas):** 1.5 - 2 minutos.
- **Accesorios (Abdominales):** 45 - 60 segundos.

---

## 2. Clasificación de Equipamiento (Prioridad Máquinas)

El sistema dará prioridad a estos elementos basándose en el Onboarding:

| Categoría | Ejemplos | Ventaja para ella |
| :--- | :--- | :--- |
| **Máquinas de Carga Directa** | Prensa, Hack Squat, Chest Press | Estabilidad máxima, permite llegar al fallo con seguridad. |
| **Poleas (Cables)** | Facepull, Glute Kickback, Lat Pulldown | Tensión constante en todo el rango de movimiento. |
| **Accesorios** | Bandas elásticas, mancuernas ligeras | Complemento para bombeo metabólico al final de la sesión. |

---

## 3. Lógica de Recomposición (Grasa vs Músculo)

### 3.1 Gasto Energético (Mifflin-St Jeor)
- Se usará esta fórmula para calcular su TDEE (Gasto Energético Total) base.
- **Déficit Sugerido:** 200-300 kcal (No agresivo para no perder fuerza).

### 3.2 Ratio Cintura-Altura (Health Marker)
- Más importante que las libras.
- **Meta Saludable:** < 0.5.
- La app celebrará cuando este ratio baje, incluso si el peso en lbs se mantiene (señal clara de pérdida de grasa y ganancia de músculo).

---

## 4. Distribución de Carga Semanal (Split Logic)

El sistema sugerirá estas distribuciones según los días que ella elija:
- **2 días:** Full Body (Énfasis en grandes grupos).
- **3 días:** Lower / Upper / Full Body.
- **4 días:** Lower / Upper / Lower / Upper (Prioridad Pierna/Glúteo según preferencia común).
- **5 días:** Push / Pull / Legs / Upper / Lower.

---

## 5. Recuperación y Sueño
- Si la usuaria reporta fatiga o "Ghost Fail" en 2 sesiones seguidas, el sistema activará automáticamente una **Semana de Descarga (Deload)** reduciendo el volumen al 50% pero manteniendo la intensidad (pesos).
