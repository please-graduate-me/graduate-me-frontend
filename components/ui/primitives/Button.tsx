'use client';
import { Button as AstryxButton } from '@astryxdesign/core/Button';
import type { ComponentProps } from 'react';
import { contentLabel } from './contentLabel';

type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'ink' | 'secondary' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
};

/** 기존 폼 제출 계약과 동작 상태를 Astryx 버튼에 연결한다. */
export function Button({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled,
  children,
  type = 'submit',
  ...props
}: ButtonProps) {
  return (
    <AstryxButton
      {...props}
      type={type}
      label={props['aria-label'] ?? contentLabel(children)}
      isDisabled={disabled}
      isLoading={loading}
      variant={
        variant === 'danger'
          ? 'destructive'
          : props['aria-pressed'] === true
            ? 'primary'
            : variant
      }
      size={size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'md'}>
      {children}
    </AstryxButton>
  );
}
