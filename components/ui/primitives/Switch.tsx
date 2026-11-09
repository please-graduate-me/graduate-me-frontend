import type { ComponentProps } from 'react';
import { root } from './Switch.css';

/** 저장되는 설정의 켜짐과 꺼짐을 접근 가능한 스위치로 표시한다. */
export function Switch({
  className,
  ...props
}: Omit<ComponentProps<'input'>, 'type' | 'role'>) {
  return (
    <input
      {...props}
      type='checkbox'
      role='switch'
      className={[root, className].filter(Boolean).join(' ')}
    />
  );
}
