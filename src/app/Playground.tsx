import React from 'react';
import cn from '@utils/classnames.ts';
import styles from './Playground.module.css';
import Car from '@app/car/Car.tsx';
import { Button } from '@theme';
import { Brain, Status } from '../useBrain.ts';

const Playground: React.FC<{
  className?: string;
  speed: number;
  turn: number;
  brain: Brain;
}> = ({ className = '', speed, turn, brain }) => {
  const ready = brain.status !== Status.IDLE && brain.status !== Status.LOADING;
  const listener = React.useMemo(() => brain.createListener(), [ready]);

  React.useEffect(() => {
    if (!ready) return;
    let isSpacePressed = false;

    const keydown = (event: KeyboardEvent) => {
      if (
        (event.code === 'Space' || event.key === ' ') &&
        !isSpacePressed &&
        (event.target as HTMLTextAreaElement)?.type !== 'textarea'
      ) {
        listener.start();
        isSpacePressed = true;
      }
    };
    const keyup = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.key === ' ') {
        listener.end();
        isSpacePressed = false;
      }
    };

    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);

    return () => {
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('keyup', keyup);
    };
  }, [ready]);

  return (
    <div className={cn(className, styles.root)}>
      <div className={cn(styles.remote)}>
        {brain.status === Status.IDLE || brain.status === Status.LOADING ? (
          <Button
            size="big"
            onClick={() => brain.setup()}
            loading={brain.status === Status.LOADING}
          >
            Connect
          </Button>
        ) : (
          <Button
            size="big"
            pulsate={brain.status === Status.LISTENING}
            onMouseDown={() => {
              listener.start();
            }}
            onMouseUp={() => {
              listener.end();
            }}
            disabled={brain.status !== Status.READY}
          >
            {brain.status === Status.LISTENING
              ? 'Listening..'
              : brain.status === Status.TALKING
                ? 'Talking..'
                : 'Click to talk'}
            <br />
            <span className={styles.buttonInstructions}>
              (or press space bar)
            </span>
          </Button>
        )}
      </div>
      <Car className={cn(styles.car)} speed={speed} turn={turn} />
    </div>
  );
};

export default Playground;
