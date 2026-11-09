import type { ComponentProps } from 'react';
import { root } from '@/lib/styles/control.css';

/** 시스템의 선택 메뉴와 기본 접근성을 유지한다. */
export function Select({ className, ...props }: ComponentProps<'select'>) {
  return (
    <select
      {...props}
      className={[root, className].filter(Boolean).join(' ')}
    />
  );
}
