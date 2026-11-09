import type { ComponentProps } from 'react';
import { root } from '@/lib/styles/control.css';

/** 브라우저의 입력 검증과 키보드 조작을 유지하는 공통 입력창이다. */
export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      {...props}
      className={[root, className].filter(Boolean).join(' ')}
    />
  );
}
