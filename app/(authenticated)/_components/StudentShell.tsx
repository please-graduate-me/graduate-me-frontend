'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { getTaggedCount } from '@/domains/community/api/community';
import { Icon } from '@/components/ui/primitives/Icon';
import { AppShell } from '@/components/ui/layouts/AppShell';
import { TopNav } from '@/components/ui/layouts/TopNav';
import { TopNavHeading } from '@/components/ui/layouts/TopNavHeading';
import { TopNavItem } from '@/components/ui/layouts/TopNavItem';
import { TopNavMenu } from '@/components/ui/layouts/TopNavMenu';
import { HStack } from '@/components/ui/layouts/HStack';
import { BrandLogo } from '../../_components/BrandLogo';
import { AccountMenu } from './AccountMenu';
import { HeaderGrowth } from './HeaderGrowth';
import { TaggedCountBadge } from './TaggedCountBadge';
import { TaggedCountContext } from './taggedCountContext';
import {
  helperDestination,
  moreDestinations,
  primaryDestinations,
} from './studentDestinations';
import * as styles from './StudentShell.css';

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
  const [taggedCount, setTaggedCount] = useState(0);

  useEffect(() => {
    if (!isHelper) return;
    let active = true;

    // 화면을 옮길 때마다 다시 세어 방금 답한 글이 배지에서 빠지게 하고, 실패해도 탐색은 막지 않는다.
    void getTaggedCount()
      .then((result) => {
        if (active) setTaggedCount(result.count);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [isHelper, pathname]);

  const tagged = { isHelper, count: isHelper ? taggedCount : 0 };

  // 레슨, PDF 읽기, 과제 풀이는 자체 집중 헤더가 있어 상단 탐색을 숨긴다.
  const immersive =
    /^\/(?:learn|materials)\/[^/]+/.test(pathname) ||
    /^\/courses\/[^/]+\/assignments\/[^/]+/.test(pathname);

  const extra = isHelper
    ? [helperDestination, ...moreDestinations]
    : moreDestinations;

  // 조교 전용 하위 경로가 커뮤니티 탭까지 선택하지 않도록 가장 긴 일치 경로 하나만 고른다.
  const selected = [...primaryDestinations, ...extra]
    .filter((item) => isWithin(pathname, item.href))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  if (immersive)
    return (
      <TaggedCountContext value={tagged}>
        <div className={styles.immersive}>{children}</div>
      </TaggedCountContext>
    );

  return (
    <TaggedCountContext value={tagged}>
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
                {primaryDestinations.map((item) => (
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
                    endContent:
                      item.href === helperDestination.href ? (
                        <TaggedCountBadge count={tagged.count} />
                      ) : undefined,
                  }))}
                />
              </>
            }
            endContent={
              <HStack gap={3}>
                <HeaderGrowth />
                <AccountMenu name={name} />
              </HStack>
            }
          />
        }>
        <div className={styles.content}>{children}</div>
      </AppShell>
    </TaggedCountContext>
  );
}
