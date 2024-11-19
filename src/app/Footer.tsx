import React from 'react';
import cn from '@utils/classnames.ts';
import styles from './Footer.module.css';
import pkg from '../../package.json';
const Footer: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <footer className={cn(styles.root, className)}>
      <p>
        <b>BenzGPT</b> (v {pkg.version}) is a Project by{' '}
        <a href="https://nico.dev" target="_blank">
          Nico Martin
        </a>
      </p>
      <p>
        This site does not collect any personal data
        <br />
        besides what is technically required.
      </p>
      <p>
        <a href="https://github.com/nico-martin/benz-gpt" target="_blank">
          github.com/nico-martin/benz-gpt
        </a>
      </p>
    </footer>
  );
};

export default Footer;
