import * as styles from './layout.css';
import { videoPaths } from '@/domains/videos/config/paths';
import { userPaths } from '@/domains/users/config/paths';
import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
/** 검색 결과와 브라우저에서 서비스 설명을 일관되게 제공한다. */
export const metadata: Metadata = {
  title: 'graduate me | 유튜브 받아쓰기',
  description: '한 구절씩 듣고, 직접 쓰고, 다시 들어보세요.',
};
/** 페이지 전환에도 공통 화면 틀과 기본 스타일을 유지한다. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko'>
      <body>
        <header className={styles.siteHeader}>
          <Link
            href={videoPaths.home}
            className={styles.brand}>
            graduate me
          </Link>
          <span>유튜브로 하는 영어 받아쓰기</span>
          <Link href={userPaths.settings}>설정</Link>
        </header>
        <main className={styles.main}>{children}</main>
        <footer className={styles.footer}>한 구절씩, 내 속도로.</footer>
      </body>
    </html>
  );
}
