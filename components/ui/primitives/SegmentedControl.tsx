'use client';
import type { ReactNode } from 'react';
import { moveRovingFocus } from '@/lib/dom/moveRovingFocus';
import { rovingValue } from './rovingValue';
import * as styles from './SegmentedControl.css';
import { SegmentedControlContext } from './segmentedControlContext';

/** 보기 방식처럼 하나만 고르는 짧은 선택지를 radiogroup으로 묶고 화살표로 이동·선택하게 한다. */
export function SegmentedControl({
  label,
  value,
  onChange,
  isDisabled = false,
  className,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
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
        tabStop: rovingValue(children, value),
      }}>
      <div
        role='radiogroup'
        aria-label={label}
        aria-disabled={isDisabled || undefined}
        className={[styles.root, className].filter(Boolean).join(' ')}
        onKeyDown={(event) => moveRovingFocus(event, '[role="radio"]')}>
        {children}
      </div>
    </SegmentedControlContext>
  );
}
