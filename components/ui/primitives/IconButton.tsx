'use client';
import type { ComponentProps } from 'react';
import * as styles from '@/lib/styles/button.css';
import { Tooltip } from './Tooltip';
import { Icon, type IconName } from './Icon';

/** 아이콘만 보이는 원형 버튼이며 이름을 말풍선과 접근성 이름으로 함께 제공한다. */
export function IconButton({
  label,
  name,
  selected,
  size = 'small',
  className,
  ...props
}: Omit<ComponentProps<'button'>, 'children'> & {
  label: string;
  name: IconName;
  selected?: boolean;
  size?: 'small' | 'medium';
}) {
  const classes = [
    styles.base,
    styles.variant.ghost,
    styles.iconOnly[size],
    className,
  ];

  return (
    <Tooltip content={label}>
      <button
        {...props}
        type={props.type ?? 'button'}
        aria-label={label}
        aria-pressed={selected}
        className={classes.filter(Boolean).join(' ')}>
        <Icon
          name={name}
          size={size === 'small' ? 16 : 20}
        />
      </button>
    </Tooltip>
  );
}
