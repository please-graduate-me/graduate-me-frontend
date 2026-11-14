'use client';
import type { ComponentProps } from 'react';
import * as styles from '@/lib/styles/button.css';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'ink' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
};

/** 폼 제출을 기본으로 하는 알약 버튼이며 처리 중에는 중복 제출을 막는다. */
export function Button({
  variant = 'primary',
  size = 'medium',
  loading = false,
  children,
  type = 'submit',
  className,
  onClick,
  ...props
}: ButtonProps) {
  const classes = [
    styles.base,
    styles.variant[variant],
    styles.size[size],
    className,
  ];

  return (
    <button
      {...props}
      // 처리 중에는 제출 버튼도 일반 버튼으로 바꿔 Enter 재제출을 막는다.
      type={loading ? 'button' : type}
      aria-busy={loading || props['aria-busy']}
      aria-disabled={loading || props['aria-disabled']}
      className={classes.filter(Boolean).join(' ')}
      onClick={loading ? (event) => event.preventDefault() : onClick}>
      {loading ? (
        <>
          <span className={styles.loadingContent}>{children}</span>
          <span
            aria-hidden='true'
            className={styles.spinner}
          />
        </>
      ) : (
        children
      )}
    </button>
  );
}
