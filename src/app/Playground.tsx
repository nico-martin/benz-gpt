import React from 'react';
import cn from '@utils/classnames.ts';
import styles from './Playground.module.css';
import Car from '@app/car/Car.tsx';

const Playground: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={cn(className, styles.root)}>
      <div className={cn(styles.remote)}>REMOTE</div>
      <Car className={cn(styles.car)} />
    </div>
  );
};

export default Playground;
