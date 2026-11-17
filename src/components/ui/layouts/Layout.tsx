import type { ReactNode } from 'react';
import * as styles from './Layout.css';

/** 대화상자 같은 틀 안에서 머리, 본문, 바닥 영역의 순서와 높이 배분을 정한다. */
export function Layout({
  header,
  content,
  footer,
  className,
}: {
  header?: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className ? `${styles.root} ${className}` : styles.root}>
      {header}
      {content}
      {footer}
    </div>
  );
}
