import type { ComponentProps } from 'react';
import { Stack } from './Stack';

/** 자식을 가운데 맞춰 가로로 놓는 Stack이다. */
export function HStack(
  props: Omit<ComponentProps<typeof Stack>, 'direction' | 'align'>
) {
  return (
    <Stack
      {...props}
      direction='horizontal'
      align='center'
    />
  );
}
