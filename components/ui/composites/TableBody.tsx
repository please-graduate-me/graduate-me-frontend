import type { ComponentProps } from 'react';

/** 표의 자료 행을 묶는다. */
export function TableBody(props: ComponentProps<'tbody'>) {
  return <tbody {...props} />;
}
