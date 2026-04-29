'use client';

import { useEffect, useState } from 'react';
import { obtenerConfig, obtenerBrainState, obtenerRutinaActiva } from '@/db/db';
import { inicializarCerebro } from '@/logic/brain/brainEngine';
import { useAppStore } from '@/store/useStore';

// Vistas
import OnboardingFlow from '@/components/Onboarding/OnboardingFlow';
import AppShell from '@/components/Layout/AppShell';

export default function HomePage() {
  const [cargando, setCargando] = useState(true);
  const { setPerfil, setRutinaActiva, setBrainState, setAppLista } = useAppStore();

  useEffect(() => {
    async function inicializar() {
      try {
        const config = await obtenerConfig();
        if (config?.onboardingCompletado) {
          setPerfil(config);
          const brain = await inicializarCerebro();
          setBrainState(brain);
          const rutina = await obtenerRutinaActiva();
          if (rutina) setRutinaActiva(rutina);
          setAppLista(true);
        }
      } catch (err) {
        console.error('Error inicializando Xfit:', err);
      } finally {
        setCargando(false);
      }
    }
    inicializar();
  }, [setPerfil, setRutinaActiva, setBrainState, setAppLista]);

  const { perfil, appLista } = useAppStore();

  if (cargando) return <SplashScreen />;
  if (!perfil || !appLista) return <OnboardingFlow />;
  return <AppShell />;
}

function SplashScreen() {
  return (
    <div className="app-container" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
      <div style={{ textAlign: 'center', animation: 'fadeInUp 0.5s ease both' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💜</div>
        <h1 className="text-display gradient-text" style={{ marginBottom: '0.5rem' }}>Xfit</h1>
        <p className="text-body">Cargando tu entrenamiento...</p>
        <div style={{
          width: '40px', height: '4px', background: 'var(--gradient-primary)',
          borderRadius: 'var(--radius-full)', margin: '1.5rem auto 0',
          animation: 'pulse-glow 1.5s infinite'
        }} />
      </div>
    </div>
  );
}
