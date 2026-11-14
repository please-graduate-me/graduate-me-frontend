import type { ComponentProps } from 'react';

/** 표의 열 제목 행을 묶는다. */
export function TableHeader(props: ComponentProps<'thead'>) {
  return <thead {...props} />;
}
