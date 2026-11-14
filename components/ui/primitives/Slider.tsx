'use client';
import { Slider as AstryxSlider } from '@astryxdesign/core/Slider';
import type { ComponentProps } from 'react';

/** 재생 위치의 숫자 변경과 접근성 문구를 Astryx 탐색 컨트롤에 연결한다. */
export function Slider({
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
  return (
    <AstryxSlider
      label={label}
      isLabelHidden
      min={min}
      max={Math.max(min, max)}
      step={step === undefined || step === 'any' ? undefined : Number(step)}
      value={value}
      isDisabled={disabled}
      htmlName={name}
      containerClassName={className}
      containerStyle={style}
      valueDisplay='none'
      formatValue={valueText ? () => valueText : undefined}
      onChange={(next: number) => {
        const target = { value: String(next), valueAsNumber: next };

        onChange?.({ target, currentTarget: target });
      }}
    />
  );
}
