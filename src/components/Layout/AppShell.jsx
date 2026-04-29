'use client';

import { useAppStore } from '@/store/useStore';
import Dashboard from '@/components/Dashboard/Dashboard';
import Entrenamiento from '@/components/Training/Entrenamiento';
import Progreso from '@/components/Progreso/Progreso';
import Ajustes from '@/components/Ajustes/Ajustes';
import Toast from '@/components/UI/Toast';
import ModalMedidas from '@/components/UI/ModalMedidas';
import styles from './AppShell.module.css';

const NAV_ITEMS = [
  { id: 'home',        label: 'Inicio',     emoji: '🏠' },
  { id: 'training',    label: 'Entrenar',   emoji: '💪' },
  { id: 'progress',    label: 'Progreso',   emoji: '📈' },
  { id: 'settings',    label: 'Ajustes',    emoji: '⚙️' },
];

const VIEWS = {
  home:     Dashboard,
  training: Entrenamiento,
  progress: Progreso,
  settings: Ajustes,
};

export default function AppShell() {
  const { vistaActual, setVista, toast, mostrarModalMedidas } = useAppStore();
  const ViewComponent = VIEWS[vistaActual] || Dashboard;

  return (
    <div className="app-container">
      <main className={styles.main}>
        <ViewComponent />
      </main>

      {/* Bottom Navigation */}
      <nav className={styles.bottomNav}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            className={`${styles.navItem} ${vistaActual === item.id ? styles.active : ''}`}
            onClick={() => setVista(item.id)}
          >
            <span className={styles.navEmoji}>{item.emoji}</span>
            <span className={styles.navLabel}>{item.label}</span>
            {vistaActual === item.id && <div className={styles.activeIndicator} />}
          </button>
        ))}
      </nav>

      {/* Toast global */}
      {toast && <Toast mensaje={toast.mensaje} tipo={toast.tipo} />}

      {/* Modal de medidas (trigger por 12 sesiones) */}
      {mostrarModalMedidas && <ModalMedidas />}
    </div>
  );
}
