'use client';
import { use, type ReactNode } from 'react';
import * as buttonStyles from '@/lib/styles/button.css';
import * as styles from './RadioListItem.css';
import { RadioListContext } from './radioListContext';

/** 라디오 묶음의 한 선택지이며 줄이나 타일 전체를 눌러도 선택된다. */
export function RadioListItem({
  value,
  label,
  description,
  icon,
  isDisabled = false,
}: {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  isDisabled?: boolean;
}) {
  const list = use(RadioListContext);

  if (!list) throw new Error('RadioListItem은 RadioList 안에서 사용한다.');
  const isTile = list.variant === 'tile';

  const classes = isTile
    ? `${buttonStyles.raised} ${styles.tile}`
    : styles.item;

  return (
    <label className={classes}>
      <input
        type='radio'
        name={list.name}
        value={value}
        checked={list.value === value}
        disabled={isDisabled}
        // 타일은 선택 색으로 상태를 보이므로 원을 숨기되 키보드 이동과 폼 제출은 라디오에 맡긴다.
        className={isTile ? styles.hiddenRadio : styles.radio}
        onChange={() => list.onChange(value)}
      />
      {icon != null && <span className={styles.icon}>{icon}</span>}
      <span className={styles.text}>
        <span>{label}</span>
        {description && (
          <span className={styles.description}>{description}</span>
        )}
      </span>
    </label>
  );
}
