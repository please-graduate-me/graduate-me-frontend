import type { ReactNode } from 'react';
import * as styles from './AppShell.css';

/** 본문 건너뛰기 링크, 상단 탐색, main 영역을 한 화면 틀로 묶는다. */
export function AppShell({
  topNav,
  children,
  height = 'auto',
  contentPadding = 0,
}: {
  topNav?: ReactNode;
  children: ReactNode;
  height?: 'auto' | 'fill';
  contentPadding?: number;
}) {
  const fill = height === 'fill';

  return (
    <div
      className={[styles.shell, fill && styles.fill].filter(Boolean).join(' ')}>
      <a
        href='#main-content'
        className={styles.skipLink}>
        본문으로 건너뛰기
      </a>
      {topNav}
      <main
        id='main-content'
        // 건너뛰기 링크로 이동했을 때 본문이 초점을 받아 다음 Tab이 본문부터 시작한다.
        tabIndex={-1}
        className={[styles.main, fill && styles.scroll]
          .filter(Boolean)
          .join(' ')}
        style={contentPadding ? { padding: contentPadding } : undefined}>
        {children}
      </main>
    </div>
  );
}
