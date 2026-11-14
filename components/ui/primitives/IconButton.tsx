'use client';
import { IconButton as AstryxIconButton } from '@astryxdesign/core/IconButton';
import type { ComponentProps } from 'react';
import { Icon, type IconName } from './Icon';

/** 서비스 아이콘 이름과 선택 상태를 Astryx 아이콘 동작에 연결한다. */
export function IconButton({
  label,
  name,
  selected,
  disabled,
  size = 'small',
  ...props
}: Omit<ComponentProps<'button'>, 'children'> & {
  label: string;
  name: IconName;
  selected?: boolean;
  size?: 'small' | 'medium';
}) {
  return (
    <AstryxIconButton
      {...props}
      type={props.type ?? 'button'}
      label={label}
      tooltip={label}
      isDisabled={disabled}
      aria-pressed={selected}
      variant={selected ? 'secondary' : 'ghost'}
      size={size === 'small' ? 'sm' : 'md'}
      icon={
        <Icon
          name={name}
          size={size === 'small' ? 16 : 20}
        />
      }
    />
  );
}
