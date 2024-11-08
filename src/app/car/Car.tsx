import cn from '@utils/classnames.ts';
import styles from './Car.module.css';
import CarSvg from '@app/car/CarSvg.tsx';
import React from 'react';
import mapRange from '@utils/mapRange.ts';

const Car: React.FC<{ className?: string }> = ({ className = '' }) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [speed, setSpeed] = React.useState<number>(0);
  const [turn, setTurn] = React.useState<number>(0);
  const carSize: number = React.useMemo(() => {
    if (!wrapperRef?.current) return 0;
    const styles = getComputedStyle(wrapperRef.current);
    return parseInt(
      styles.getPropertyValue('--playground-element-width').trim()
    );
  }, [wrapperRef?.current]);

  React.useEffect(() => {
    if (!wrapperRef?.current) return;

    wrapperRef.current.style.setProperty('--direction', `${turn}deg`);
    if (speed === 0) {
      wrapperRef.current.style.setProperty('--wheel-turning-speed', `${0}ms`);
    } else if (speed < 0) {
      const adjustedSpeed = mapRange(speed, -100, 0, 1000, 300);
      console.log(adjustedSpeed);
      wrapperRef.current.style.setProperty(
        '--wheel-turning-speed-direction',
        'normal'
      );
      wrapperRef.current.style.setProperty(
        '--wheel-turning-speed',
        `${adjustedSpeed}ms`
      );
    } else {
      const adjustedSpeed = mapRange(speed, 0, 100, 1000, 300);
      console.log(adjustedSpeed);
      wrapperRef.current.style.setProperty(
        '--wheel-turning-speed-direction',
        'reverse'
      );
      wrapperRef.current.style.setProperty(
        '--wheel-turning-speed',
        `${adjustedSpeed}ms`
      );
    }
  }, [wrapperRef, speed, turn]);

  return (
    <React.Fragment>
      <div className={cn(className, styles.root)} ref={wrapperRef}>
        {[1, 2, 3, 4].map((e) => (
          <div
            key={e}
            className={cn(styles.tire, {
              [styles.tireFL]: e === 1,
              [styles.tireFR]: e === 2,
              [styles.tireBL]: e === 3,
              [styles.tireBR]: e === 4,
            })}
          />
        ))}
        <CarSvg className={styles.svg} />
      </div>
      <ul>
        <li>
          <button onClick={() => setSpeed(0)}>speed0</button>
        </li>
        <li>
          <button onClick={() => setSpeed(20)}>speed20</button>
        </li>
        <li>
          <button onClick={() => setSpeed(60)}>speed60</button>
        </li>
        <li>
          <button onClick={() => setSpeed(100)}>speed100</button>
        </li>
        <li>
          <button onClick={() => setSpeed(-50)}>speed-50</button>
        </li>
        <li>
          <button onClick={() => setTurn(20)}>direction20</button>
        </li>
        <li>
          <button onClick={() => setTurn(-20)}>direction-20</button>
        </li>
        <li>
          <button onClick={() => setTurn(0)}>direction0</button>
        </li>
      </ul>
    </React.Fragment>
  );
};

export default Car;
