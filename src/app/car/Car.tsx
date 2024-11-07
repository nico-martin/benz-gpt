import cn from '@utils/classnames.ts';
import styles from './Car.module.css';
import CarSvg from '@app/car/CarSvg.tsx';
import React from 'react';
const Car: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={cn(className, styles.root)}>
      <CarSvg className={styles.svg} />
    </div>
  );
};

export default Car;
