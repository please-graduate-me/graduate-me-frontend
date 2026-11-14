'use client';
import { Card } from '@astryxdesign/core/Card';
import type { ComponentProps } from 'react';

/** 기존 영역의 시맨틱 태그를 보존하며 Astryx 카드로 내용을 구분한다. */
export function Panel({
  as: Tag = 'section',
  children,
  ...props
}: ComponentProps<'section'> & { as?: 'section' | 'article' }) {
  return (
    <Tag {...props}>
      <Card>{children}</Card>
    </Tag>
  );
}
