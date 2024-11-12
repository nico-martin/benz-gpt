import React from 'react';
import cn from '@utils/classnames.ts';
import { Brain, Status } from '../useBrain.ts';
import Form from './sidebar/Form.tsx';
import styles from './Sidebar.module.css';
import Chat from './sidebar/Chat.tsx';
import { Icon, IconName } from '@theme';

const Sidebar: React.FC<{
  className?: string;
  brain: Brain;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}> = ({ className = '', brain, sidebarOpen, toggleSidebar }) => {
  const ready = brain.status !== Status.IDLE && brain.status !== Status.LOADING;

  return (
    <div className={cn(className, styles.root)}>
      <button className={styles.toggler} onClick={() => toggleSidebar()}>
        <Icon icon={sidebarOpen ? IconName.ARROW_RIGHT : IconName.FORUM} />
      </button>
      {!ready ? (
        <p className={styles.connect}>
          Please connect before you can interact with the car.
        </p>
      ) : (
        <React.Fragment>
          <Chat className={styles.chat} messages={brain.messages} />
          <Form className={styles.form} processRequest={brain.generateAnswer} />
        </React.Fragment>
      )}
    </div>
  );
};

export default Sidebar;
