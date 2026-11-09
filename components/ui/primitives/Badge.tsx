import type { ComponentProps } from 'react';
import * as styles from './Badge.css';

/** 의미를 색상뿐 아니라 실제 문구와 함께 전달한다. */
export function Badge({
  tone = 'neutral',
  className,
  ...props
}: ComponentProps<'span'> & { tone?: keyof typeof styles.tones }) {
  return (
    <span
      {...props}
      className={[styles.root, styles.tones[tone], className]
        .filter(Boolean)
        .join(' ')}
    />
  );
}
