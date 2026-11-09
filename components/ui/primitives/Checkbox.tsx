import type { ComponentProps } from 'react';
import { root } from './Checkbox.css';

/** 브라우저의 체크 상태와 폼 전달을 그대로 사용하는 선택 컨트롤이다. */
export function Checkbox({
  className,
  ...props
}: Omit<ComponentProps<'input'>, 'type'>) {
  return (
    <input
      {...props}
      type='checkbox'
      className={[root, className].filter(Boolean).join(' ')}
    />
  );
}
