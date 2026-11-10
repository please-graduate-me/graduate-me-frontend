import type { ComponentProps, CSSProperties } from 'react';
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
      style={{ ...style, [styles.progress]: `${percent}%` } as CSSProperties}
    />
  );
}
