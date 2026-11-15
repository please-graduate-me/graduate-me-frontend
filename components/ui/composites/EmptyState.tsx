import type { ReactNode } from 'react';
import { Icon, type IconName } from '../primitives/Icon';
import * as styles from './EmptyState.css';

/** 내용이 없을 때 이유와 다음 행동을 아이콘이나 그림과 함께 안내하며 회색 면이나 점선 상자를 고른다. */
export function EmptyState({
  title,
  description,
  children,
  icon = 'book-open',
  illustration,
  variant = 'filled',
  iconTone = 'accent',
  iconShape = 'circle',
  headingLevel,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
  icon?: IconName;
  illustration?: ReactNode;
  variant?: 'filled' | 'dashed';
  iconTone?: 'accent' | 'neutral';
  iconShape?: 'circle' | 'square';
  headingLevel?: 2 | 3;
}) {
  const isDashed = variant === 'dashed';
  // 제목을 문서 개요에 넣어야 하는 화면만 제목 요소로 올리고 기본은 문단으로 둔다.
  const Title = headingLevel ? (`h${headingLevel}` as const) : 'p';

  const iconClasses = [
    styles.icon,
    styles.iconTone[iconTone],
    isDashed && styles.iconLarge,
    iconShape === 'square' && styles.iconSquare,
  ];

  return (
    <div className={`${styles.root} ${styles.variant[variant]}`}>
      {illustration ?? (
        <span className={iconClasses.filter(Boolean).join(' ')}>
          <Icon
            name={icon}
            size={isDashed ? 26 : 24}
          />
        </span>
      )}
      <Title
        className={
          isDashed ? `${styles.title} ${styles.titleLarge}` : styles.title
        }>
        {title}
      </Title>
      {description && <p className={styles.description}>{description}</p>}
      {children && <div className={styles.actions}>{children}</div>}
    </div>
  );
}
