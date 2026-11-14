import type { ComponentProps } from 'react';
import * as styles from './Table.css';

/** 실제 table 요소로 행과 열의 관계를 보조 기술에 전달하고, caption이 있으면 표 이름으로 쓴다. */
export function Table({
  caption,
  className,
  children,
  ...props
}: ComponentProps<'table'> & { caption?: string }) {
  return (
    <div className={styles.scroll}>
      <table
        {...props}
        className={className ? `${styles.root} ${className}` : styles.root}>
        {caption && <caption className={styles.caption}>{caption}</caption>}
        {children}
      </table>
    </div>
  );
}
