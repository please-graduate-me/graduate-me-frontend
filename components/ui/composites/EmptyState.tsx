import type { ReactNode } from 'react';
import { Icon, type IconName } from '../primitives/Icon';
import * as styles from './EmptyState.css';

/** 내용이 없을 때 이유와 다음 행동을 서비스 아이콘과 함께 안내한다. */
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
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {children && <div className={styles.actions}>{children}</div>}
    </div>
  );
}
