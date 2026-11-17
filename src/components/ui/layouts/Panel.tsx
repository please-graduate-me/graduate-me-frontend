import type { ComponentProps } from 'react';
import { Card } from '../primitives/Card';

/** 기존 영역의 시맨틱 태그를 카드 면 한 겹으로 그려 화면의 className이 카드에 바로 적용되게 한다. */
export function Panel({
  as = 'section',
  ...props
}: ComponentProps<'section'> & { as?: 'section' | 'article' }) {
  return (
    <Card
      as={as}
      {...props}
    />
  );
}
