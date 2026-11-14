'use client';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import type { ComponentProps } from 'react';
import * as styles from './Slider.css';

/** 재생 위치를 네이티브 범위 입력으로 조작하고 채워진 구간을 청록으로 표시한다. */
export function Slider({
  id,
  min = 0,
  max = 100,
  value,
  step,
  disabled,
  name,
  className,
  style,
  onChange,
  'aria-label': label = '재생 위치',
  'aria-valuetext': valueText,
}: Omit<
  ComponentProps<'input'>,
  'type' | 'min' | 'max' | 'value' | 'defaultValue' | 'onChange'
> & {
  min?: number;
  max?: number;
  value: number;
  onChange?: (event: {
    target: { value: string; valueAsNumber: number };
    currentTarget: { value: string; valueAsNumber: number };
  }) => void;
}) {
  const upper = Math.max(min, max);
  const ratio = upper === min ? 0 : (value - min) / (upper - min);

  return (
    <input
      id={id}
      type='range'
      min={min}
      max={upper}
      step={step}
      value={value}
      disabled={disabled}
      name={name}
      aria-label={label}
      aria-valuetext={valueText}
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={{
        ...style,
        ...assignInlineVars({
          [styles.fill]: `${Math.min(1, Math.max(0, ratio)) * 100}%`,
        }),
      }}
      onChange={onChange}
    />
  );
}
