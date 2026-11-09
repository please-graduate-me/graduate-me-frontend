import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/primitives/Icon';
import * as styles from './layout.css';

/** 공개 화면은 학습 앱과 같은 브랜드를 유지하면서 간결한 진입 탐색을 제공한다. */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Link
          href='/'
          className={styles.brand}>
          <span className={styles.mark}>
            <Icon
              name='book-open'
              size={18}
            />
          </span>
          graduate me
        </Link>
        <nav aria-label='서비스 소개'>
          <Link
            href='/library'
            className={styles.login}>
            로그인
          </Link>
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <strong>graduate me</strong>
        <span>읽고, 듣고, 질문하며 나의 언어로.</span>
        <Link href='/library'>
          학습 시작하기
          <Icon
            name='arrow-right'
            size={16}
          />
        </Link>
      </footer>
    </div>
  );
}
