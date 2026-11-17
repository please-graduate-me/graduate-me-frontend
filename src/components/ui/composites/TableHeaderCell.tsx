import type { ComponentProps } from 'react';
import * as styles from './TableHeaderCell.css';

/** 열 제목 칸으로, 기본적으로 아래 칸들의 열 제목임을 알린다. */
export function TableHeaderCell({
  scope = 'col',
  className,
  ...props
}: ComponentProps<'th'>) {
  return (
    <th
      {...props}
      scope={scope}
      className={className ? `${styles.root} ${className}` : styles.root}
    />
  );
}
