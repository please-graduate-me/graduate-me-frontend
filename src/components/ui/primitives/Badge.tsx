import type { ComponentProps } from 'react';
import * as styles from './Badge.css';

/** 서비스 상태의 의미를 시안의 색 짝으로 표시하는 작은 표지이며 작은 크기와 사각 모양을 고를 수 있다. */
export function Badge({
  tone = 'neutral',
  size = 'medium',
  shape = 'pill',
  className,
  ...props
}: ComponentProps<'span'> & {
  tone?: keyof typeof styles.tone;
  size?: 'medium' | 'small';
  shape?: 'pill' | 'square';
}) {
  const classes = [
    styles.root,
    styles.tone[tone],
    size === 'small' && styles.small,
    shape === 'square' && styles.square,
    className,
  ];

  return (
    <span
      {...props}
      className={classes.filter(Boolean).join(' ')}
    />
  );
}
