import cn from '@utils/classnames.ts';
import styles from './Car.module.css';
import CarSvg from '@app/car/CarSvg.tsx';
import React from 'react';
import mapRange from '@utils/mapRange.ts';

const Car: React.FC<{ className?: string; speed: number; turn: number }> = ({
  className = '',
  speed = 0,
  turn = 0,
}) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  /*const carSize: number = React.useMemo(() => {
    if (!wrapperRef?.current) return 0;
    const styles = getComputedStyle(wrapperRef.current);
    return parseInt(
      styles.getPropertyValue('--playground-element-width').trim()
    );
  }, [wrapperRef?.current]);*/

  React.useEffect(() => {
    if (!wrapperRef?.current) return;

    wrapperRef.current.style.setProperty('--direction', `${turn}deg`);
    if (speed === 0) {
      wrapperRef.current.style.setProperty('--wheel-turning-speed', `${0}ms`);
    } else if (speed < 0) {
      const adjustedSpeed = mapRange(speed, -100, 0, 1000, 300);
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
    <div className={cn(className, styles.root)} ref={wrapperRef}>
      <div
        className={cn(styles.carOuterWrapper, {
          [styles.carOuterWrapperForward]: speed > 0,
          [styles.carOuterWrapperBackward]: speed < 0,
        })}
      >
        <div className={cn(styles.carWrapper)}>
          {Array(4)
            .fill('')
            .map((_e, i) => (
              <div key={i} className={cn(styles.tire)} />
            ))}
          <div className={cn(styles.rearWind)}>
            {Array(5)
              .fill('')
              .map((_e, i) => (
                <div key={i} className={cn(styles.rearWindElement)} />
              ))}
          </div>
          <div className={cn(styles.frontWind)}>
            {Array(7)
              .fill('')
              .map((_e, i) => (
                <div key={i} className={cn(styles.frontWindElement)} />
              ))}
          </div>
          <CarSvg className={styles.svg} />
        </div>
      </div>
      <p className={styles.meta}>
        <span className={styles.metaInformation}>
          Speed: <code>{speed}%</code>
        </span>
        <span className={styles.metaInformation}>
          Direction: <code>{turn}°</code>
        </span>
      </p>
    </div>
  );
};

export default Car;
