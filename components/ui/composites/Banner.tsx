import type { HTMLAttributes, ReactNode } from 'react';
import * as styles from './Banner.css';

/** 안내, 주의, 오류 상태의 제목과 본문을 색 상자로 표시한다. */
export function Banner({
  status,
  title,
  className,
  children,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  status: keyof typeof styles.status;
  title: ReactNode;
}) {
  const hasBody = children != null && children !== false;

  return (
    <div
      {...props}
      className={[styles.root, styles.status[status], className]
        .filter(Boolean)
        .join(' ')}>
      {/* 본문 없이 제목만 쓰는 안내는 긴 문장이라 굵게 하지 않고 바탕색으로만 상태를 나눈다. */}
      <div
        className={
          hasBody ? `${styles.title} ${styles.titleTone[status]}` : undefined
        }>
        {title}
      </div>
      {hasBody && <div>{children}</div>}
    </div>
  );
}
