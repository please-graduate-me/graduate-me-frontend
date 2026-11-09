import type { ComponentProps } from 'react';
import * as styles from '@/lib/styles/button.css';

/** 화면 이동을 버튼과 같은 위계로 보여 주면서 링크의 기본 동작을 유지한다. */
export function ButtonLink({
  variant = 'primary',
  size = 'medium',
  className,
  ...props
}: ComponentProps<'a'> & {
  variant?: keyof typeof styles.variants;
  size?: keyof typeof styles.sizes;
}) {
  return (
    <a
      {...props}
      className={[
        styles.root,
        styles.variants[variant],
        styles.sizes[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
