'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from '@/components/ui/primitives/Icon';
import * as styles from './StudentShell.css';

const destinations: { href: string; label: string; icon: IconName }[] = [
  { href: '/library', label: '내 학습', icon: 'house' },
  { href: '/materials', label: '자료 보관함', icon: 'layers' },
  { href: '/expressions', label: '개인 표현집', icon: 'bookmark' },
  { href: '/practice', label: '연습·복습', icon: 'repeat-2' },
  { href: '/history', label: '학습 기록', icon: 'chart-no-axes-column' },
  { href: '/insights', label: '학습 분석', icon: 'chart-no-axes-column' },
  { href: '/recommendations', label: '추천 영상', icon: 'play' },
  { href: '/courses', label: '내 수업과 과제', icon: 'users' },
  { href: '/community', label: '학습 커뮤니티', icon: 'message-circle' },
];

/** 학생의 학습 탐색과 계정 정보를 제공하고 전용 학습 화면에는 전체 폭을 내어 준다. */
export function StudentShell({
  children,
  name,
  isHelper = false,
}: {
  children: ReactNode;
  name: string;
  isHelper?: boolean;
}) {
  const pathname = usePathname();
  const immersive = /^\/(?:learn|materials)\/[^/]+/.test(pathname);

  const navigation = isHelper
    ? [
        ...destinations,
        {
          href: '/community/tagged',
          label: '나를 태그한 글',
          icon: 'bell' as const,
        },
      ]
    : destinations;

  const current = [...navigation]
    .reverse()
    .find(
      (item) => pathname === item.href || pathname.startsWith(item.href + '/')
    );

  const title =
    current?.label ??
    (pathname === '/settings'
      ? '학습 설정'
      : pathname === '/admin'
        ? '관리자 앱 안내'
        : '내 학습 공간');

  const initial = name.trim().slice(0, 1) || '나';

  if (immersive) return <main className={styles.immersive}>{children}</main>;

  return (
    <div className={styles.shell}>
      <aside
        className={styles.sidebar}
        aria-label='학생 서비스 탐색'>
        <Link
          href='/library'
          className={styles.brand}>
          graduate me
        </Link>
        <Link
          href='/library'
          className={styles.workspace}>
          <span className={styles.avatar}>{initial}</span>
          <strong>내 학습 공간</strong>
        </Link>
        <nav
          className={styles.navigation}
          aria-label='주 메뉴'>
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.navItem}
              aria-current={current?.href === item.href ? 'page' : undefined}>
              <Icon
                name={item.icon}
                size={18}
              />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.languages}>
          <h2>내 학습 언어</h2>
          <p>
            <span
              className={styles.languageDot}
              data-language='en'
            />
            영어
          </p>
          <p>
            <span
              className={styles.languageDot}
              data-language='th'
            />
            태국어
          </p>
        </div>
        <div className={styles.bottom}>
          <Link
            href='/community'
            className={styles.help}>
            <strong>궁금한 점이 있나요?</strong>
            <span>커뮤니티에서 조교를 태그해 보세요.</span>
          </Link>
          <Link
            href='/settings'
            className={styles.account}>
            <span className={styles.avatar}>{initial}</span>
            <span className={styles.accountInfo}>
              <strong>{name}</strong>
              <small>{isHelper ? '조교' : '학습자'}</small>
            </span>
            <Icon
              name='settings'
              size={16}
            />
          </Link>
        </div>
      </aside>
      <div className={styles.main}>
        <header className={styles.topbar}>
          <span className={styles.breadcrumb}>{title}</span>
          <Link
            href='/materials'
            className={styles.search}>
            <Icon
              name='search'
              size={18}
            />
            자료 검색
          </Link>
          <Link
            href='/community'
            aria-label='커뮤니티 확인'>
            <Icon
              name='bell'
              size={18}
            />
          </Link>
          <Link
            href='/settings'
            className={styles.avatar}
            aria-label='계정 설정'>
            {initial}
          </Link>
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
