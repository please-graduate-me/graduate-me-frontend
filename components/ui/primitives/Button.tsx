'use client';
import type { ComponentProps } from 'react';
import * as styles from '@/lib/styles/button.css';
import {
  buttonClassName,
  buttonIconSize,
  type ButtonAppearance,
} from './buttonClassName';
import { Icon, type IconName } from './Icon';

type ButtonProps = ComponentProps<'button'> &
  ButtonAppearance & {
    loading?: boolean;
    startIcon?: IconName;
    endIcon?: IconName;
  };

/** 폼 제출을 기본으로 하는 버튼이며 처리 중에는 중복 제출을 막는다. */
export function Button({
  variant = 'primary',
  size = 'medium',
  shape,
  pressedTone,
  hasPressedPop,
  loading = false,
  startIcon,
  endIcon,
  children,
  type = 'submit',
  className,
  onClick,
  ...props
}: ButtonProps) {
  const content = (
    <>
      {startIcon && (
        <Icon
          name={startIcon}
          size={buttonIconSize[size]}
          className={styles.icon}
        />
      )}
      {children}
      {endIcon && (
        <Icon
          name={endIcon}
          size={buttonIconSize[size]}
          className={styles.icon}
        />
      )}
    </>
  );

  return (
    <button
      {...props}
      // 처리 중에는 제출 버튼도 일반 버튼으로 바꿔 Enter 재제출을 막는다.
      type={loading ? 'button' : type}
      aria-busy={loading || props['aria-busy']}
      aria-disabled={loading || props['aria-disabled']}
      className={buttonClassName({
        variant,
        size,
        shape,
        pressedTone,
        hasPressedPop,
        className,
      })}
      onClick={loading ? (event) => event.preventDefault() : onClick}>
      {loading ? (
        <>
          <span className={styles.loadingContent}>{content}</span>
          <span
            aria-hidden='true'
            className={styles.spinner}
          />
        </>
      ) : (
        content
      )}
    </button>
  );
}
