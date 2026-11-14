'use client';
import { EmptyState as AstryxEmptyState } from '@astryxdesign/core/EmptyState';
import type { ReactNode } from 'react';
import { Icon, type IconName } from '../primitives/Icon';

/** 빈 상태의 서비스 아이콘과 후속 동작을 Astryx 슬롯에 연결한다. */
export function EmptyState({
  title,
  description,
  children,
  icon = 'book-open',
}: {
  title: string;
  description?: string;
  children?: ReactNode;
  icon?: IconName;
}) {
  return (
    <AstryxEmptyState
      title={title}
      description={description}
      icon={
        <Icon
          name={icon}
          size={24}
        />
      }
      actions={children}
    />
  );
}
