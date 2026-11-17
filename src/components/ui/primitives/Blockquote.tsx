import type { ComponentProps } from 'react';
import * as styles from './Blockquote.css';

/** 원문에서 가져온 구절을 인용 블록으로 표시한다. */
export function Blockquote({
  className,
  ...props
}: ComponentProps<'blockquote'>) {
  return (
    <blockquote
      {...props}
      className={className ? `${styles.root} ${className}` : styles.root}
    />
  );
}
