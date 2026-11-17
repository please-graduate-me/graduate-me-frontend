import type { HTMLAttributes } from 'react';
import * as styles from './SelectableCard.css';

/** 카드 전체를 선택 상자로 만들고 label과 선택 상태를 보조 기술에 전달하며 필요하면 보이는 체크 표시를 붙인다. */
export function SelectableCard({
  label,
  isSelected,
  onChange,
  hasIndicator = false,
  className,
  children,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  label: string;
  isSelected: boolean;
  onChange: (isSelected: boolean) => void;
  hasIndicator?: boolean;
}) {
  const classes = [
    styles.root,
    hasIndicator && styles.withIndicator,
    isSelected && styles.selected,
    className,
  ];

  return (
    <div
      {...props}
      className={classes.filter(Boolean).join(' ')}>
      {hasIndicator && (
        // 색만으로 선택을 구분하지 않도록 체크 모양을 함께 그리며 실제 상태는 덮개 입력이 알린다.
        <span
          aria-hidden='true'
          className={styles.indicator}
        />
      )}
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
