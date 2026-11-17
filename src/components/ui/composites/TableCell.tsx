import type { ComponentProps } from 'react';
import * as styles from './TableCell.css';

/** 표의 자료 칸이다. */
export function TableCell({ className, ...props }: ComponentProps<'td'>) {
  return (
    <td
      {...props}
      className={className ? `${styles.root} ${className}` : styles.root}
    />
  );
}
