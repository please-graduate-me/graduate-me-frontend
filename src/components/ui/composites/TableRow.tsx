import type { ComponentProps } from 'react';

/** 표의 한 행이다. */
export function TableRow(props: ComponentProps<'tr'>) {
  return <tr {...props} />;
}
