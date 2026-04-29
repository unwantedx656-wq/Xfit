# Xfit: Mapa de Estructura del Proyecto

Esta es la organización final de archivos y carpetas para el desarrollo de Xfit.

```text
Xfit/
├── public/                 # Assets estáticos (iconos, manifest)
├── src/
│   ├── app/                # Next.js App Router (Páginas y Layouts)
│   ├── components/         # Componentes React
│   │   ├── Dashboard/      # Resumen, gráficas de progreso
│   │   ├── Layout/         # Navigations, Sidebars
│   │   ├── Onboarding/     # Flujo de registro step-by-step
│   │   ├── Training/       # Checklist y sesión activa
│   │   └── UI/             # Botones, Cards, Inputs (Design System)
│   ├── data/               # Bases de datos estáticas
│   │   ├── ejercicios.js   # [RECICLADO] Base de datos de ejercicios
│   │   └── rangos-peso.js  # [RECICLADO] Referencias de carga
│   ├── db/                 # Configuración de persistencia
│   │   └── db.js           # Dexie (IndexedDB)
│   ├── logic/              # Cerebros y algoritmos
│   │   ├── brain/          # Aprendizaje automático
│   │   │   ├── personalizador.js # [RECICLADO] Priorización
│   │   │   └── scoreEjercicio.js # [RECICLADO] Evaluación
│   │   ├── utils/          # Helpers matemáticos y de fecha
│   │   └── workout/        # Generación de rutinas
│   │       └── generadorRutina.js # [RECICLADO] Motor FITT-VP
│   ├── store/              # Estado global (Zustand)
│   ├── styles/             # Estilos y temas
│   │   └── global.css      # [RECICLADO] Variables y reset
│   ├── truth/              # Librería de Referencia Científica
│   │   └── reference.js    # La Fuente de la Verdad
│   └── types/              # Definiciones de TypeScript (opcional)
├── AUDITORIA.md            # Rúbricas de calidad
├── BUGS.md                 # Registro de errores
├── Estructura.md           # Este archivo
├── PROGRESO.md             # Roadmap y estado
├── Sugerencias.md          # Ideas de mejora
├── XFIT_BRAIN_LOGIC.md     # Definición del Cerebro
├── XFIT_DEFINITIONS.md     # Definición de Funciones
├── XFIT_ONBOARDING_FLOW.md # Definición de Flujo
├── XFIT_SCIENTIFIC_TRUTH.md# Definición Científica
└── XFIT_TECH_VISUAL.md     # Definición de Diseño
```
