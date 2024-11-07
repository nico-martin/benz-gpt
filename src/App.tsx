import { createRoot } from 'react-dom/client';
import React from 'react';

import styles from './App.module.css';
import Chat from '@app/Chat.tsx';
import LlmContextProvider from './llm/LlmContextProvider.tsx';
import useLlm from './llm/useLlm.ts';
import cn from '@utils/classnames.ts';
import Form from '@app/Form.tsx';
import Setup from '@app/Setup.tsx';
import { LlmStatus } from './llm/llmContext.ts';
import WebBluetoothCarContextProvider from './webBluetooth/WebBluetoothCarContextProvider.tsx';
import useBrain from './useBrain.ts';
import Header from '@app/Header.tsx';
import Playground from '@app/Playground.tsx';

const App: React.FC = () => {
  const [introDone, setIntroDone] = React.useState<boolean>(false);

  return (
    <div className={cn(styles.root, { [styles.introDone]: introDone })}>
      <Header
        className={cn(styles.header)}
        onIntroDone={() => setIntroDone(true)}
      />
      <Playground className={cn(styles.playground)} />
      {/*status === LlmStatus.READY ? (
        <div className={cn(styles.main)}>
          <Chat className={styles.chat} />
          <Form className={styles.form} processRequest={processRequest} />
        </div>
      ) : (
        <Setup />
      )*/}
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
