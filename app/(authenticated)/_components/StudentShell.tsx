'use client';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from '@/components/ui/primitives/Icon';
import { AppShell } from '@astryxdesign/core/AppShell';
import {
  TopNav,
  TopNavHeading,
  TopNavItem,
  TopNavMenu,
} from '@astryxdesign/core/TopNav';
import { Avatar } from '@astryxdesign/core/Avatar';
import { HStack } from '@astryxdesign/core/HStack';
import { BrandLogo } from '../../_components/BrandLogo';
import { HeaderGrowth } from './HeaderGrowth';
import * as styles from './StudentShell.css';

type Destination = { href: string; label: string; icon: IconName };

const primary: Destination[] = [
  { href: '/library', label: '홈', icon: 'house' },
  { href: '/materials', label: '자료 보관함', icon: 'layers' },
  { href: '/community', label: '커뮤니티', icon: 'message-circle' },
  { href: '/ranking', label: '랭킹', icon: 'chart-no-axes-column' },
];

const more: Destination[] = [
  { href: '/expressions', label: '개인 표현집', icon: 'bookmark' },
  { href: '/practice', label: '연습·복습', icon: 'repeat-2' },
  { href: '/courses', label: '내 수업과 과제', icon: 'users' },
  { href: '/history', label: '학습 기록', icon: 'clock' },
  { href: '/insights', label: '학습 분석', icon: 'chart-no-axes-column' },
  { href: '/recommendations', label: '추천 영상', icon: 'play' },
  { href: '/questions', label: '커뮤니티에 질문하기', icon: 'send' },
];

const tagged: Destination = {
  href: '/community/tagged',
  label: '나를 태그한 글',
  icon: 'bell',
};

const isWithin = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(href + '/');

/** 주요 학습 공간 4곳은 상단 탭으로, 나머지는 더보기로 묶고 전용 학습 화면에는 전체 폭을 내어 준다. */
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
  const extra = isHelper ? [tagged, ...more] : more;

  // 조교 전용 하위 경로가 커뮤니티 탭까지 선택하지 않도록 가장 긴 일치 경로 하나만 고른다.
  const selected = [...primary, ...extra]
    .filter((item) => isWithin(pathname, item.href))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  if (immersive) return <div className={styles.immersive}>{children}</div>;

  return (
    <AppShell
      height='auto'
      contentPadding={0}
      topNav={
        <TopNav
          label='학습 공간 상단 탐색'
          heading={
            <TopNavHeading
              heading='Please graduate me'
              headingHref='/library'
              logo={<BrandLogo />}
            />
          }
          startContent={
            <>
              {primary.map((item) => (
                <TopNavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  isSelected={selected === item.href}
                />
              ))}
              <TopNavMenu
                label='더보기'
                items={extra.map((item) => ({
                  title: item.label,
                  href: item.href,
                  icon: (
                    <Icon
                      name={item.icon}
                      size={18}
                    />
                  ),
                }))}
              />
            </>
          }
          endContent={
            <HStack gap={3}>
              <HeaderGrowth />
              <Avatar
                name={name}
                href='/settings'
                size='sm'
              />
            </HStack>
          }
        />
      }>
      <div className={styles.content}>{children}</div>
    </AppShell>
  );
}
