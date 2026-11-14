import type { LiHTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import * as styles from './ListItem.css';

/** 이름, 설명과 앞뒤 내용을 한 줄로 표시하고 onClick이 있으면 항목 전체를 버튼으로 만든다. */
export function ListItem({
  label,
  description,
  startContent,
  endContent,
  onClick,
  isSelected = false,
  isDisabled = false,
  className,
  'aria-current': ariaCurrent,
  ...props
}: Omit<LiHTMLAttributes<HTMLLIElement>, 'onClick'> & {
  label: ReactNode;
  description?: ReactNode;
  startContent?: ReactNode;
  endContent?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isSelected?: boolean;
  isDisabled?: boolean;
}) {
  const classes = [
    styles.root,
    onClick && !isDisabled && styles.interactive,
    isSelected && styles.selected,
    isDisabled && styles.disabled,
    className,
  ];

  const text = (
    <>
      <span
        className={
          isSelected || description != null
            ? `${styles.label} ${styles.strongLabel}`
            : styles.label
        }>
        {label}
      </span>
      {description != null && (
        <span className={styles.description}>{description}</span>
      )}
    </>
  );

  return (
    <li
      {...props}
      // 선택은 listitem에 aria-selected를 쓸 수 없어 호출부 값이 없을 때 aria-current로 알린다.
      aria-current={ariaCurrent ?? (isSelected ? 'true' : undefined)}
      className={classes.filter(Boolean).join(' ')}>
      {startContent != null && (
        <span className={styles.slot}>{startContent}</span>
      )}
      {onClick ? (
        <button
          type='button'
          // 비활성 항목도 초점은 받아 이유를 읽을 수 있게 disabled 대신 aria-disabled를 쓴다.
          aria-disabled={isDisabled || undefined}
          onClick={isDisabled ? undefined : onClick}
          className={`${styles.content} ${styles.action}`}>
          {text}
        </button>
      ) : (
        <span className={styles.content}>{text}</span>
      )}
      {endContent != null && <span className={styles.slot}>{endContent}</span>}
    </li>
  );
}
