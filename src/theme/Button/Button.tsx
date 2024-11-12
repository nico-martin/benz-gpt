import React from 'react';
import { IconName, Loader, Icon } from '@theme';
import styles from './Button.module.css';
import cn from '@utils/classnames';

interface ButtonProps {
  children?: React.ReactElement | string | Array<React.ReactElement | string>;
  className?: string;
  classNameIcon?: string;
  onClick?: () => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  icon?: IconName;
  iconRight?: boolean;
  iconCircle?: boolean;
  loading?: boolean;
  disabled?: boolean;
  progress?: number;
  noPadding?: boolean;
  size?: 'small' | 'medium' | 'big';
  pulsate?: boolean;
  [key: string]: any;
}

const Button: React.ForwardRefExoticComponent<ButtonProps> = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      children = '',
      className = '',
      classNameIcon = '',
      onClick = () => {},
      onMouseDown = () => {},
      onMouseUp = () => {},
      icon = null,
      iconRight = false,
      iconCircle = false,
      loading = false,
      progress = null,
      disabled = false,
      noPadding = false,
      size = 'medium',
      pulsate = false,
      ...props
    },
    ref
  ) => {
    return (
      <button
        {...props}
        disabled={disabled || loading || progress !== null}
        className={cn(className, styles.button, {
          [styles.buttonIsDisabled]: disabled,
          [styles.buttonIsLoading]: loading || progress !== null,
          [styles.buttonHasNoText]: children === '',
          [styles.buttonHasIcon]: Boolean(icon),
          [styles.buttonIconRight]: Boolean(iconRight),
          [styles.buttonNoPadding]: noPadding,
          [styles.buttonSizeSmall]: size === 'small',
          [styles.buttonSizeBig]: size === 'big',
          [styles.pulsate]: pulsate,
        })}
        onClick={() => onClick()}
        onMouseDown={() => onMouseDown()}
        onMouseUp={() => onMouseUp()}
        ref={ref}
      >
        <div className={styles.bkg} />
        <div className={styles.loader}>
          <Loader className={styles.loaderIcon} />
          {progress && <span className={styles.progress}>{progress}%</span>}
        </div>

        {Boolean(icon) && !iconRight && (
          <Icon
            className={cn(styles.icon, styles.iconLeft, classNameIcon)}
            icon={icon}
            circle={iconCircle}
          />
        )}
        <span className={styles.content}>{children}</span>
        {Boolean(icon) && iconRight && (
          <Icon
            className={cn(styles.icon, styles.iconRight, classNameIcon)}
            icon={icon}
            circle={iconCircle}
          />
        )}
      </button>
    );
  }
);

export default Button;
