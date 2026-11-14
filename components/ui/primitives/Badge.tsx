import type { ComponentProps } from 'react';
import * as styles from './Badge.css';

/** 서비스 상태의 의미를 시안의 색 짝으로 표시하는 작은 표지다. */
export function Badge({
  tone = 'neutral',
  className,
  ...props
}: ComponentProps<'span'> & { tone?: keyof typeof styles.tone }) {
  return (
    <span
      {...props}
      className={[styles.root, styles.tone[tone], className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
