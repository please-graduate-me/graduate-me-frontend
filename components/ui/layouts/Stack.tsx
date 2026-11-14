import type { ComponentProps } from 'react';
import * as styles from './Stack.css';

/** 자식을 일정 간격으로 세로나 가로로 쌓는 배치 틀이다. */
export function Stack({
  direction = 'vertical',
  align,
  gap,
  className,
  ...props
}: ComponentProps<'div'> & {
  direction?: 'vertical' | 'horizontal';
  align?: 'center';
  gap?: keyof typeof styles.gap;
}) {
  const classes = [
    styles.root,
    direction === 'horizontal' && styles.horizontal,
    align === 'center' && styles.center,
    gap != null && styles.gap[gap],
    className,
  ];

  return (
    <div
      {...props}
      className={classes.filter(Boolean).join(' ')}
    />
  );
}
