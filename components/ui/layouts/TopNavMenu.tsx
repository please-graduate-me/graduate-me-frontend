'use client';
import NextLink from 'next/link';
import { useId, type ReactNode } from 'react';
import { DropdownMenu } from '../composites/DropdownMenu';
import { Icon } from '../primitives/Icon';
import * as styles from './TopNavMenu.css';

/** 더보기 메뉴 한 줄의 이동 주소나 동작이다. */
export type TopNavMenuItemData = {
  title: string;
  href?: string;
  icon?: ReactNode;
  onClick?: () => void;
};

/** 넓은 화면에서는 드롭다운, 접힌 패널에서는 펼친 목록으로 보이는 상단 더보기 메뉴다. */
export function TopNavMenu({
  label,
  items,
}: {
  label: string;
  items: TopNavMenuItemData[];
}) {
  const headingId = useId();

  return (
    <>
      <div className={styles.desktop}>
        <DropdownMenu
          trigger={
            <button
              type='button'
              className={styles.trigger}>
              {label}
              <Icon
                name='chevron-down'
                size={16}
              />
            </button>
          }
          items={items.map((item) => ({
            id: item.href ?? item.title,
            label: item.title,
            href: item.href,
            icon: item.icon,
            onClick: item.onClick,
          }))}
        />
      </div>
      <div
        role='group'
        aria-labelledby={headingId}
        className={styles.mobile}>
        <p
          id={headingId}
          className={styles.heading}>
          {label}
        </p>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.href ?? item.title}>
              {item.href ? (
                <NextLink
                  href={item.href}
                  className={styles.link}>
                  {item.icon && (
                    <span className={styles.icon}>{item.icon}</span>
                  )}
                  {item.title}
                </NextLink>
              ) : (
                <button
                  type='button'
                  className={styles.link}
                  onClick={item.onClick}>
                  {item.icon && (
                    <span className={styles.icon}>{item.icon}</span>
                  )}
                  {item.title}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
