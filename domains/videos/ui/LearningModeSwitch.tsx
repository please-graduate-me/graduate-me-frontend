'use client';
import { SegmentedControl } from '@/components/ui/primitives/SegmentedControl';
import { SegmentedControlItem } from '@/components/ui/primitives/SegmentedControlItem';
import type { Mode } from '../model/mode';
import * as styles from './LearningModeSwitch.css';

/** 동일한 학습 방식을 체험과 개인 학습에서 같은 위치와 조작으로 제공한다. */
export function LearningModeSwitch({
  mode,
  disabled = false,
  onChange,
  blankAvailable = true,
  active = true,
}: {
  mode: Mode;
  disabled?: boolean;
  onChange: (mode: Mode) => void;
  blankAvailable?: boolean;
  active?: boolean;
}) {
  return (
    <SegmentedControl
      className={styles.root}
      label='학습 방식'
      value={active ? mode : ''}
      isDisabled={disabled}
      onChange={(value) => {
        if (value === 'full' || value === 'blank') onChange(value);
      }}>
      <SegmentedControlItem
        value='full'
        label='문장 전체'
      />
      <SegmentedControlItem
        value='blank'
        label='빈칸 채우기'
        isDisabled={!blankAvailable}
      />
    </SegmentedControl>
  );
}
