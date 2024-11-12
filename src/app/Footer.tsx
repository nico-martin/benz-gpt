import React from 'react';
import cn from '@utils/classnames.ts';
import styles from './Footer.module.css';

const Footer: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <footer className={cn(styles.root, className)}>
      <p>
        <b>BenzGPT</b> is a Project by{' '}
        <a href="https://nico.dev" target="_blank">
          Nico Martin
        </a>
      </p>
      <p>
        This site does not collect any personal data
        <br />
        besides what is technically required.
      </p>
    </footer>
  );
};

export default Footer;
