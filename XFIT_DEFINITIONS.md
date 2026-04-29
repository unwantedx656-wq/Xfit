# Xfit: Proyecto de Acompañamiento Inteligente y Científico

## 1. Filosofía del Proyecto
Xfit es una PWA offline-first diseñada para una usuaria experimentada de 25 años. Su enfoque principal es la **Recomposición Corporal** (Perder grasa conservando masa muscular) mediante entrenamiento de fuerza, utilizando un sistema de aprendizaje implícito que adapta la experiencia sin abrumar a la usuaria con preguntas innecesarias.

---

## 2. El "Cerebro" (Motor de Aprendizaje Adaptativo)

### 2.1 Captura de Metadatos (Input Silencioso)
Cada vez que la usuaria interactúa con una sesión, el sistema guarda:
- **Timestamp:** Fecha y hora exacta.
- **Día del Microciclo:** (Lunes, Martes, etc.) para detectar patrones de energía semanales.
- **Modificaciones Manuales:** Si añadió un ejercicio, cambió el peso o sustituyó una máquina.
- **Ratio de Completado:** Ejercicios realizados vs. ejercicios programados.

### 2.2 Análisis por Tanda (Batch Processing)
Para evitar la degradación del rendimiento, el sistema utiliza un modelo de "Compresión de Conocimiento":
1. **Recolección:** Se guardan los datos crudos de las últimas N sesiones.
2. **Análisis:** Al completar una tanda (ej. 12 sesiones), el sistema genera un "Perfil de Tendencia".
3. **Comparación:** Se compara la *Tendencia Actual* con la *Tendencia Anterior*.
4. **Fusión:** Los resultados se consolidan en un único archivo de **Estado del Usuario**. El sistema olvida los datos crudos antiguos y solo conserva la "sabiduría" extraída (ej: "Suele tener más fuerza los martes", "Falla en prensa de piernas después del ejercicio 4").

---

## 3. Onboarding Dinámico (Perfil Inicial)

El proceso de registro se divide en pantallas atómicas para evitar fatiga visual:

### Pantalla 1: Identidad Básica
- **Edad:** Calculada mediante fecha de nacimiento.
- **Género:** Femenino (Optimizado para su fisiología).

### Pantalla 2: Métricas Físicas (Unidades Salvadoreñas)
- **Peso Actual:** Default en Libras (Lbs).
- **Peso Deseado:** Meta fundamental para cálculos de déficit/mantenimiento.
- **Estatura:** Pulgadas/Cms.

### Pantalla 3: Objetivos de Recomposición
- **Perder Grasa (Principal):** Enfoque en déficit leve y alta intensidad.
- **Mantener/Ganar Músculo:** Enfoque en volumen de entrenamiento (Series/Repeticiones).
- **Mejorar Condición (Cardio):** Inclusión opcional de bloques de cardio post-pesas.

### Pantalla 4: Equipamiento (Selector de Máquinas)
- Lista de máquinas comunes (Prensa, Smith, Poleas, Leg Extension, etc.).
- La usuaria marca lo que tiene disponible. La app **excluirá** el resto de la base de datos de "Verdad".

---

## 4. Gestión de Entrenamiento (UX/UI)

### 4.1 Generador de Rutinas
- **Flexibilidad:** El usuario define cuántos días quiere entrenar a la semana.
- **Periodización:** Posibilidad de generar bloques de 1, 2 o 4 semanas.
- **Restricción Científica:** Aunque la usuaria tiene libertad total, el sistema sugerirá (pero no bloqueará) días de descanso basados en el volumen acumulado por grupo muscular.

### 4.2 Ejecución de Sesión (Checklist)
- **Modo Lista:** Interfaz limpia donde cada ejercicio se tacha al completar.
- **Edición On-the-fly:** Botón para cambiar peso, reps o añadir/quitar series durante el entrenamiento.
- **Sustitución Inteligente:** Si una máquina está ocupada, botón "Cambiar" que sugiere otro ejercicio para el mismo músculo usando solo las máquinas marcadas en el onboarding.

### 4.3 El "Ghost Fail" (Aprendizaje Voluntario/Involuntario)
- Si la sesión se marca como "Finalizada" pero hay ejercicios sin tachar, el cerebro asume **Incapacidad** o **Falta de Tiempo**. 
- Si la usuaria aumenta el peso manualmente y completa todas las repeticiones, el cerebro asume **Aumento de Capacidad** y ajusta la base de la próxima rutina.

---

## 5. Control de Progreso (Métricas)

### 5.1 El Trigger de las 12 Sesiones
- El sistema **no** solicita medidas por fecha calendario.
- Al completar 12 sesiones efectivas, se desbloquea el módulo de **Actualización de Tallas**.
- **Medidas Clave:** Cintura, Cadera, Muslo, Brazo. (Pecho omitido por variabilidad de tejido adiposo no muscular).

---

## 6. Referencia de la Verdad (Logic Science)

Todo el sistema consultará una carpeta `/src/truth/` que contiene:
- **MuscleMap:** Relación de ejercicios -> Músculos primarios/secundarios.
- **IntensityLaws:** Relación entre Repeticiones, RPE y descansos recomendados.
- **RecoveryTable:** Tiempo de descanso necesario según el tamaño del músculo y la intensidad aplicada.
