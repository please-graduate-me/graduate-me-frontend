import type { ComponentProps } from 'react';
import * as styles from './LayoutFooter.css';

/** Layout의 바닥 동작 영역이다. */
export function LayoutFooter({
  hasDivider = false,
  className,
  ...props
}: ComponentProps<'div'> & { hasDivider?: boolean }) {
  const classes = [styles.root, hasDivider && styles.divider, className];

  return (
    <div
      {...props}
      className={classes.filter(Boolean).join(' ')}
    />
  );
}
