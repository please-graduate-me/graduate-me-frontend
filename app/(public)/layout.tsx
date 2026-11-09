import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/primitives/Icon';
import * as styles from './layout.css';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { AuthButton } from '../_components/AuthButton';
import { getPublicSession } from './_components/getPublicSession';

/** 공개 화면은 학습 앱과 같은 브랜드를 유지하면서 간결한 진입 탐색을 제공한다. */
export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { configured, session } = await getPublicSession();

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
          {session?.user ? (
            <ButtonLink
              href='/library'
              variant='secondary'>
              내 학습 공간
            </ButtonLink>
          ) : (
            <AuthButton
              action='signin'
              variant='secondary'
              label='로그인'
              disabled={!configured}
            />
          )}
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
