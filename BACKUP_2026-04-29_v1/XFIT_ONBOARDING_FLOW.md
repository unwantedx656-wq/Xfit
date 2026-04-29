# Xfit: Flujo de Onboarding (Step-by-Step)

El onboarding está diseñado para capturar la esencia de la usuaria sin abrumarla. Cada pantalla es un componente independiente.

## Paso 1: Bienvenida e Identidad
- **UI:** Animación suave con los colores Awesome Lilac.
- **Pregunta:** "¿Cómo te llamas?" (Para personalizar los mensajes).
- **Pregunta:** "¿Cuándo es tu cumpleaños?" (Para calcular la edad exactas y ajustar metabolismo).

## Paso 2: El Punto de Partida (Métricas)
- **UI:** Selector tipo "Wheel" o Input grande con teclado numérico.
- **Dato:** "¿Cuánto pesas hoy?" (Default: **Libras**).
- **Dato:** "¿Cuál es tu estatura?" (Pulgadas / Cms).

## Paso 3: El Destino (Objetivos)
- **UI:** Tarjetas visuales con iconos minimalistas.
- **Opciones:**
  - **Recomposición:** "Perder grasa y verme más tonificada" (Default).
  - **Fuerza Máxima:** "Levantar más peso y ser más fuerte".
  - **Mantenimiento:** "Sentirme bien y mantener mi ritmo".
- **Pregunta Crítica:** "¿Cuál es tu peso meta?" (lbs).

## Paso 4: Definición de Tallas (Base)
- **UI:** Ilustración simple de la silueta femenina resaltando las zonas.
- **Inputs:** Cintura, Cadera, Muslo, Brazo.
- **Nota:** "Esto servirá para comparar tu progreso real más allá de la báscula".

## Paso 5: Disponibilidad (El Plan)
- **Pregunta:** "¿Cuántos días a la semana *realmente* puedes entrenar?" (Selector 1-7).
- **Pregunta:** "¿Cuántos ejercicios quieres hacer por sesión?" (Sugerido: 5-7).
- **Pregunta:** "¿Cuánto tiempo sueles tener por sesión?" (30, 45, 60, 90 min).

## Paso 6: Equipamiento (La Caja de Herramientas)
- **UI:** Checklist con iconos de máquinas.
- **Opciones:** Prensa, Smith, Poleas, Extensiones, Femoral, Hack Squat, Hip Thrust Machine, Mancuernas, etc.
- **Acción:** "Solo te mostraremos ejercicios que puedas hacer con lo que selecciones".

## Paso 7: Finalización (Generando el Cerebro)
- **UI:** Pantalla de carga con mensaje: "Configurando tus leyes científicas y entrenando a tu cerebro...".
- **Resultado:** Redirección al Dashboard principal con la primera rutina lista.

---

## Lógica de Ajustes Posteriores
- Todos estos datos se guardan en el objeto `UserConfig` en IndexedDB.
- En la sección "Ajustes", la usuaria puede volver a cualquier paso.
- **Impacto:** Si cambia el equipamiento en Ajustes, la siguiente rutina generada se adaptará automáticamente sin borrar el historial.
