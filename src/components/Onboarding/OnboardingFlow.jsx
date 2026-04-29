'use client';

import { useState } from 'react';
import { guardarConfig, guardarBrainState } from '@/db/db';
import { BRAIN_STATE_INICIAL } from '@/logic/brain/brainEngine';
import { useAppStore } from '@/store/useStore';
import { generarRutina } from '@/logic/workout/generadorRutina';
import { guardarRutina } from '@/db/db';

import Step1Identidad from './Step1Identidad';
import Step2Metricas from './Step2Metricas';
import Step3Objetivos from './Step3Objetivos';
import Step4Tallas from './Step4Tallas';
import Step5Disponibilidad from './Step5Disponibilidad';
import Step6Equipamiento from './Step6Equipamiento';
import Step7Final from './Step7Final';

import styles from './Onboarding.module.css';

const TOTAL_STEPS = 7;

const STEPS = [
  Step1Identidad, Step2Metricas, Step3Objetivos,
  Step4Tallas, Step5Disponibilidad, Step6Equipamiento, Step7Final,
];

const STEP_LABELS = [
  '¡Hola!', 'Tu cuerpo', 'Tu meta', 'Tus medidas',
  'Tu plan', 'Tu gym', '¡Listo!'
];

export default function OnboardingFlow() {
  const [paso, setPaso] = useState(0);
  const [datos, setDatos] = useState({
    nombre: '',
    fechaNacimiento: '',
    pesoActual: '',
    pesoMeta: '',
    talla: '',
    unidadPeso: 'lbs',
    unidadTalla: 'in',
    objetivo: 'recomp',
    cintura: '', cadera: '', muslo: '', brazo: '',
    diasSemana: 3,
    ejerciciosPorSesion: 6,
    tiempoSesion: 60,
    equipamiento: [],
  });
  const [generando, setGenerando] = useState(false);
  const { setPerfil, setRutinaActiva, setBrainState, setAppLista } = useAppStore();

  const avanzar = (nuevosDatos = {}) => {
    setDatos(prev => ({ ...prev, ...nuevosDatos }));
    if (paso < TOTAL_STEPS - 1) {
      setPaso(paso + 1);
    }
  };

  const retroceder = () => { if (paso > 0) setPaso(paso - 1); };

  const finalizar = async (nuevosDatos = {}) => {
    setGenerando(true);
    const datosFinal = { ...datos, ...nuevosDatos, onboardingCompletado: true };
    try {
      await guardarConfig(datosFinal);
      const brainInicial = { ...BRAIN_STATE_INICIAL };
      await guardarBrainState(brainInicial);
      const rutina = generarRutina(datosFinal, brainInicial);
      await guardarRutina(rutina);
      setPerfil(datosFinal);
      setBrainState(brainInicial);
      setRutinaActiva(rutina);
      setAppLista(true);
    } catch (err) {
      console.error('Error finalizando onboarding:', err);
      setGenerando(false);
    }
  };

  const StepComponent = STEPS[paso];
  const progreso = ((paso + 1) / TOTAL_STEPS) * 100;

  return (
    <div className={styles.container}>
      {/* Header con progreso */}
      <div className={styles.header}>
        <div className={styles.stepInfo}>
          <span className={styles.stepLabel}>{STEP_LABELS[paso]}</span>
          <span className={styles.stepCount}>{paso + 1} / {TOTAL_STEPS}</span>
        </div>
        <div className="progress-bar" style={{ marginTop: '8px' }}>
          <div className="progress-fill" style={{ width: `${progreso}%` }} />
        </div>
      </div>

      {/* Contenido del paso */}
      <div className={styles.content} key={paso}>
        <StepComponent
          datos={datos}
          onAvanzar={avanzar}
          onRetroceder={retroceder}
          onFinalizar={finalizar}
          generando={generando}
          esPrimero={paso === 0}
          esUltimo={paso === TOTAL_STEPS - 1}
        />
      </div>
    </div>
  );
}
