import type { HTMLAttributes } from 'react';
import * as styles from './SelectableCard.css';

/** 카드 전체를 선택 상자로 만들고 label과 선택 상태를 보조 기술에 전달한다. */
export function SelectableCard({
  label,
  isSelected,
  onChange,
  className,
  children,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  label: string;
  isSelected: boolean;
  onChange: (isSelected: boolean) => void;
}) {
  const classes = [styles.root, isSelected && styles.selected, className];

  return (
    <div
      {...props}
      className={classes.filter(Boolean).join(' ')}>
      {children}
      <input
        type='checkbox'
        aria-label={label}
        checked={isSelected}
        onChange={() => onChange(!isSelected)}
        className={styles.input}
      />
    </div>
  );
}
