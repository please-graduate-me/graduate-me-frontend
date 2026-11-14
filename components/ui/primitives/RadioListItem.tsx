'use client';
import { use, type ReactNode } from 'react';
import * as styles from './RadioListItem.css';
import { RadioListContext } from './radioListContext';

/** 라디오 묶음의 한 선택지이며 줄 전체를 눌러도 선택된다. */
export function RadioListItem({
  value,
  label,
  description,
  isDisabled = false,
}: {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  isDisabled?: boolean;
}) {
  const list = use(RadioListContext);

  if (!list) throw new Error('RadioListItem은 RadioList 안에서 사용한다.');

  return (
    <label className={styles.item}>
      <input
        type='radio'
        name={list.name}
        value={value}
        checked={list.value === value}
        disabled={isDisabled}
        className={styles.radio}
        onChange={() => list.onChange(value)}
      />
      <span className={styles.text}>
        <span>{label}</span>
        {description && (
          <span className={styles.description}>{description}</span>
        )}
      </span>
    </label>
  );
}
