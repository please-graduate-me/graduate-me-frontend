import { assignInlineVars } from '@vanilla-extract/dynamic';
import type { ComponentProps } from 'react';
import * as styles from './Slider.css';

/** 진행률 표시와 구분되는 키보드·포인터 재생 탐색을 제공한다. */
export function Slider({
  min = 0,
  max = 100,
  value,
  className,
  style,
  ...props
}: Omit<
  ComponentProps<'input'>,
  'type' | 'min' | 'max' | 'value' | 'defaultValue'
> & { min?: number; max?: number; value: number }) {
  const percent =
    max > min
      ? Math.max(0, Math.min(100, (100 * (value - min)) / (max - min)))
      : 0;

  return (
    <input
      {...props}
      type='range'
      min={min}
      max={max}
      value={value}
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={{
        ...style,
        // CSS 변수 참조 자체를 속성 이름으로 쓰면 트랙의 채움 값이 전달되지 않는다.
        ...assignInlineVars({ [styles.progress]: `${percent}%` }),
      }}
    />
  );
}
