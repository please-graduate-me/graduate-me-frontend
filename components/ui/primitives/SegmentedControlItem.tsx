'use client';
import { use, type ReactNode } from 'react';
import * as styles from './SegmentedControlItem.css';
import { SegmentedControlContext } from './segmentedControlContext';

/** 분할 선택의 한 항목이며 선택된 항목만 Tab 순서에 남긴다. */
export function SegmentedControlItem({
  value,
  label,
  isLabelHidden = false,
  icon,
  isDisabled = false,
}: {
  value: string;
  label: string;
  isLabelHidden?: boolean;
  icon?: ReactNode;
  isDisabled?: boolean;
}) {
  const group = use(SegmentedControlContext);

  if (!group)
    throw new Error('SegmentedControlItem은 SegmentedControl 안에서 사용한다.');
  const selected = group.value === value;

  return (
    <button
      type='button'
      role='radio'
      aria-checked={selected}
      aria-label={isLabelHidden ? label : undefined}
      tabIndex={group.tabStop === value ? 0 : -1}
      disabled={group.isDisabled || isDisabled}
      className={styles.item}
      onClick={() => {
        if (!selected) group.onChange(value);
      }}>
      {icon}
      {!isLabelHidden && label}
    </button>
  );
}
