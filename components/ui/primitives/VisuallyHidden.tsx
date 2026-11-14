import type { ComponentProps } from 'react';
import * as styles from './VisuallyHidden.css';

/** 화면에는 보이지 않지만 화면 읽기 프로그램이 읽는 글자를 둔다. */
export function VisuallyHidden({
  className,
  ...props
}: ComponentProps<'span'>) {
  return (
    <span
      {...props}
      className={className ? `${styles.root} ${className}` : styles.root}
    />
  );
}
