import { createRoot } from 'react-dom/client';
import React from 'react';

import styles from './App.module.css';
import LlmContextProvider from './llm/LlmContextProvider.tsx';
import cn from '@utils/classnames.ts';
import WebBluetoothCarContextProvider from './webBluetooth/WebBluetoothCarContextProvider.tsx';
import Header from '@app/Header.tsx';
import Playground from '@app/Playground.tsx';
import Sidebar from '@app/Sidebar.tsx';
import useBrain from './useBrain.ts';

const SIDEBAR_WIDTH = 400;

const App: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [introDone, setIntroDone] = React.useState<boolean>(false);
  const [speed, setSpeed] = React.useState<number>(0);
  const [turn, setTurn] = React.useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(true);

  const brain = useBrain(setSpeed, setTurn);

  React.useEffect(() => {
    if (!ref.current) return;
    ref.current.style.setProperty('--sidebar-width', SIDEBAR_WIDTH + 'px');
    ref.current.style.setProperty(
      '--sidebar-translate-x',
      (sidebarOpen ? 0 : SIDEBAR_WIDTH) + 'px'
    );
    ref.current.style.setProperty(
      '--app-translate-x',
      (sidebarOpen ? SIDEBAR_WIDTH / 2 : 0) + 'px'
    );
  }, [ref, sidebarOpen]);

  return (
    <div
      ref={ref}
      className={cn(styles.root, {
        [styles.introDone]: introDone,
        [styles.sidebarOpen]: sidebarOpen,
      })}
    >
      <Header
        className={cn(styles.header)}
        onIntroDone={() => setIntroDone(true)}
      />
      <Playground
        className={cn(styles.playground)}
        speed={speed}
        turn={turn}
        brain={brain}
      />
      <Sidebar
        className={cn(styles.sidebar)}
        brain={brain}
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <LlmContextProvider>
    <WebBluetoothCarContextProvider>
      <App />
    </WebBluetoothCarContextProvider>
  </LlmContextProvider>
);
