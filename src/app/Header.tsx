import React from 'react';
import cn from '@utils/classnames.ts';
import styles from './Header.module.css';
import useTypingEffect from '@utils/useTypingEffect.ts';

const Header: React.FC<{
  className?: string;
  onIntroDone: () => void;
}> = ({ className = '', onIntroDone }) => {
  const displayedElements = useTypingEffect(
    [
      { text: '', pauseAfter: 10 },
      { text: 'Hi,', pauseAfter: 7 },
      { text: ' I am ' },
      { text: 'BenzGPT', Element: 'span', props: { className: styles.title } },
      { text: '.', pauseAfter: 7 },
      { text: ' Your AI Agent powered Car.', pauseAfter: 20 },
    ],
    3000,
    onIntroDone
  );

  return (
    <header className={cn(styles.root, className)}>
      <h1 className={cn(styles.h1)}>
        {displayedElements.map((element, index) => (
          <React.Fragment key={index}>{element}</React.Fragment>
        ))}
      </h1>
    </header>
  );
};

export default Header;
