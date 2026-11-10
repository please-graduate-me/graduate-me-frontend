import type { ComponentProps } from 'react';
import { root } from './Radio.css';

/** 네이티브 라디오 그룹의 키보드 조작과 폼 전달을 유지한다. */
export function Radio({
  className,
  ...props
}: Omit<ComponentProps<'input'>, 'type'>) {
  return (
    <input
      {...props}
      type='radio'
      className={[root, className].filter(Boolean).join(' ')}
    />
  );
}
