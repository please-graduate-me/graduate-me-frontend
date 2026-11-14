'use client';
import type { AriaRole, ReactNode } from 'react';
import { moveRovingFocus } from '@/lib/dom/moveRovingFocus';
import { rovingValue } from './rovingValue';
import * as styles from './TabList.css';
import { TabListContext } from './tabListContext';

/** 밑줄 탭 줄이며 role="tablist"면 WAI-ARIA 탭, 아니면 aria-current로 현재 보기를 알리는 탐색 묶음이 된다. */
export function TabList({
  value,
  onChange,
  role,
  hasDivider = false,
  className,
  children,
  'aria-label': label,
}: {
  value: string;
  onChange: (value: string) => void;
  role?: AriaRole;
  hasDivider?: boolean;
  className?: string;
  children?: ReactNode;
  'aria-label'?: string;
}) {
  const isTablist = role === 'tablist';
  const Root = role === undefined ? 'nav' : 'div';

  const classes = [styles.root, hasDivider && styles.divider, className];

  return (
    <TabListContext
      value={{
        value,
        onChange,
        isTablist,
        tabStop: rovingValue(children, value),
      }}>
      <Root
        role={role}
        aria-label={label}
        className={classes.filter(Boolean).join(' ')}
        onKeyDown={(event) => moveRovingFocus(event, '[data-tab]')}>
        {children}
      </Root>
    </TabListContext>
  );
}
