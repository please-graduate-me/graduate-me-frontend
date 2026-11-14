'use client';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from '@/components/ui/primitives/Icon';
import { AppShell } from '@astryxdesign/core/AppShell';
import {
  SideNav,
  SideNavHeading,
  SideNavItem,
  SideNavSection,
} from '@astryxdesign/core/SideNav';
import { TopNav, TopNavHeading } from '@astryxdesign/core/TopNav';
import { Avatar } from '@astryxdesign/core/Avatar';
import { Badge } from '@astryxdesign/core/Badge';
import { HStack } from '@astryxdesign/core/HStack';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import * as styles from './StudentShell.css';

const destinations: { href: string; label: string; icon: IconName }[] = [
  { href: '/library', label: '내 학습', icon: 'house' },
  { href: '/materials', label: '자료 보관함', icon: 'layers' },
  { href: '/expressions', label: '개인 표현집', icon: 'bookmark' },
  { href: '/practice', label: '연습·복습', icon: 'repeat-2' },
  { href: '/history', label: '학습 기록', icon: 'chart-no-axes-column' },
  { href: '/ranking', label: '학습 성장·랭킹', icon: 'chart-no-axes-column' },
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

  if (immersive) return <div className={styles.immersive}>{children}</div>;

  return (
    <AppShell
      height='auto'
      contentPadding={0}
      sideNav={
        <SideNav
          aria-label='학생 서비스 탐색'
          header={
            <SideNavHeading
              heading='graduate me'
              headingHref='/library'
              subheading='나의 언어 학습 공간'
            />
          }
          footer={
            <SideNavItem
              label={name}
              href='/settings'
              isSelected={pathname.startsWith('/settings')}
              icon={
                <Avatar
                  name={name}
                  size='sm'
                  tooltip={false}
                />
              }
              endContent={<Badge label={isHelper ? '조교' : '학습자'} />}
            />
          }>
          <SideNavSection title='학습 공간'>
            {navigation.map((item) => (
              <SideNavItem
                key={item.href}
                href={item.href}
                label={item.label}
                isSelected={current?.href === item.href}
                icon={
                  <Icon
                    name={item.icon}
                    size={18}
                  />
                }
              />
            ))}
          </SideNavSection>
          <SideNavSection title='도움과 설정'>
            <SideNavItem
              label='학습 설정'
              href='/settings'
              icon={
                <Icon
                  name='settings'
                  size={18}
                />
              }
              isSelected={pathname.startsWith('/settings')}
            />
            <SideNavItem
              label='커뮤니티에 질문하기'
              href='/questions'
              icon={
                <Icon
                  name='message-circle'
                  size={18}
                />
              }
            />
          </SideNavSection>
        </SideNav>
      }
      topNav={
        <TopNav
          label='학습 공간 상단 탐색'
          heading={<TopNavHeading heading={title} />}
          endContent={
            <HStack gap={3}>
              <ButtonLink
                href='/materials'
                variant='secondary'>
                자료 검색
              </ButtonLink>
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
