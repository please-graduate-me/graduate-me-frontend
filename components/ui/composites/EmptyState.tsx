import type { ReactNode } from 'react';
import { Icon, type IconName } from '../primitives/Icon';
import * as styles from './EmptyState.css';

/** 비어 있는 이유와 사용자가 이어서 할 수 있는 행동을 함께 표시한다. */
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
    <div className={styles.root}>
      <span className={styles.icon}>
        <Icon
          name={icon}
          size={24}
        />
      </span>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}
