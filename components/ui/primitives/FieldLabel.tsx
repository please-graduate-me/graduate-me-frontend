import type { ReactNode } from 'react';
import * as styles from '@/lib/styles/field.css';

/** 입력 위 라벨이며 필요하면 회색 "필수" 표지와 큰 글자 단계를 붙인다. */
export function FieldLabel({
  htmlFor,
  hasRequiredTag = false,
  size = 'medium',
  children,
}: {
  htmlFor: string;
  hasRequiredTag?: boolean;
  size?: 'medium' | 'large';
  children: ReactNode;
}) {
  const classes = [
    styles.label,
    size === 'large' && styles.labelLarge,
    hasRequiredTag && styles.labelRow,
  ];

  return (
    <label
      htmlFor={htmlFor}
      className={classes.filter(Boolean).join(' ')}>
      {children}
      {hasRequiredTag && <span className={styles.requiredTag}>필수</span>}
    </label>
  );
}
