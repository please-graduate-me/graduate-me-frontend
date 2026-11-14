import type { ComponentProps } from 'react';
import * as styles from './LayoutContent.css';

/** Layout의 본문 영역이다. */
export function LayoutContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={className ? `${styles.root} ${className}` : styles.root}
    />
  );
}
