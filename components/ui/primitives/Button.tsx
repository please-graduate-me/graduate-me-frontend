import type { ComponentProps } from 'react';
import * as styles from './Button.css';
type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary';
};
/** 버튼 상태와 변형의 표현이 사용처마다 달라지지 않게 한다. */
export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={[styles.root, styles.variants[variant], className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
