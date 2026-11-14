'use client';
import { Button as AstryxButton } from '@astryxdesign/core/Button';
import type { ComponentProps } from 'react';
import { contentLabel } from './contentLabel';

/** 이동 링크의 기존 변형 이름과 접근성 문구를 Astryx에 연결한다. */
export function ButtonLink({
  variant = 'primary',
  size = 'medium',
  children,
  onClick,
  ...props
}: Pick<
  ComponentProps<'a'>,
  'href' | 'target' | 'rel' | 'className' | 'style' | 'children' | 'aria-label'
> & {
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium';
}) {
  return (
    <AstryxButton
      {...props}
      onClick={onClick}
      label={props['aria-label'] ?? contentLabel(children)}
      variant={variant === 'danger' ? 'destructive' : variant}
      size={size === 'small' ? 'sm' : 'md'}>
      {children}
    </AstryxButton>
  );
}
