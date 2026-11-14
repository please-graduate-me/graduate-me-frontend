'use client';
import { Badge as AstryxBadge } from '@astryxdesign/core/Badge';
import type { ComponentProps } from 'react';

/** 서비스 상태의 의미를 Astryx 배지 변형에 대응한다. */
export function Badge({
  tone = 'neutral',
  children,
  ...props
}: ComponentProps<'span'> & {
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'review';
}) {
  return (
    <AstryxBadge
      {...props}
      label={children}
      variant={tone === 'brand' ? 'info' : tone === 'review' ? 'purple' : tone}
    />
  );
}
