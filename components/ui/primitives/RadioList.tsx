'use client';
import { useId, type ReactNode } from 'react';
import * as styles from './RadioList.css';
import { RadioListContext } from './radioListContext';

/** 네이티브 라디오 묶음으로 하나를 고르게 해 화살표 이동과 폼 제출을 브라우저에 맡기며 tile이면 가로 타일로 나열한다. */
export function RadioList({
  label,
  htmlName,
  value,
  onChange,
  variant = 'list',
  isDisabled = false,
  className,
  children,
}: {
  label: string;
  htmlName?: string;
  value: string;
  onChange: (value: string) => void;
  variant?: 'list' | 'tile';
  isDisabled?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const generatedName = useId();

  return (
    <RadioListContext
      value={{ name: htmlName ?? generatedName, value, variant, onChange }}>
      <fieldset
        disabled={isDisabled}
        className={[styles.root, className].filter(Boolean).join(' ')}>
        <legend className={styles.legend}>{label}</legend>
        <div className={styles.options[variant]}>{children}</div>
      </fieldset>
    </RadioListContext>
  );
}
