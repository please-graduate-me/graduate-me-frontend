'use client';
import type { ReactNode } from 'react';
import { moveRovingFocus } from '@/lib/dom/moveRovingFocus';
import { rovingValue } from './rovingValue';
import * as styles from './SegmentedControl.css';
import { SegmentedControlContext } from './segmentedControlContext';

/** 하나만 고르는 짧은 선택지를 radiogroup으로 묶고 화살표로 이동·선택하게 하며 알약, 전체 폭 블록, 칩 모양을 고른다. */
export function SegmentedControl({
  label,
  value,
  onChange,
  variant = 'pill',
  isDisabled = false,
  className,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  variant?: 'pill' | 'block' | 'chip';
  isDisabled?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <SegmentedControlContext
      value={{
        value,
        onChange,
        isDisabled,
        variant,
        tabStop: rovingValue(children, value),
      }}>
      <div
        role='radiogroup'
        aria-label={label}
        aria-disabled={isDisabled || undefined}
        className={[styles.root, styles.variant[variant], className]
          .filter(Boolean)
          .join(' ')}
        onKeyDown={(event) => moveRovingFocus(event, '[role="radio"]')}>
        {children}
      </div>
    </SegmentedControlContext>
  );
}
