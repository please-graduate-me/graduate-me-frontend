import type { ComponentProps } from 'react';
import * as styles from './Button.css';
import { Icon } from './Icon';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium';
  loading?: boolean;
};

/** 버튼 상태와 변형의 표현이 사용처마다 달라지지 않게 한다. */
export function Button({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={[
        styles.root,
        styles.variants[variant],
        styles.sizes[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}>
      {loading && (
        <Icon
          name='loader-circle'
          className={styles.spinner}
        />
      )}
      {children}
    </button>
  );
}
