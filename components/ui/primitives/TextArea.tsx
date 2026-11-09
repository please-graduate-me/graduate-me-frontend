import type { ComponentProps } from 'react';
import { root as input } from '@/lib/styles/control.css';
import { root } from './TextArea.css';

/** 여러 줄 입력의 크기와 상태를 공통 규칙으로 표현한다. */
export function TextArea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      {...props}
      className={[input, root, className].filter(Boolean).join(' ')}
    />
  );
}
