'use client';
import { useState, type ComponentProps } from 'react';
import * as styles from './Checkbox.css';

/** 네이티브 체크 상자에 라벨을 붙이고 초기값만 받은 체크도 제어 상태로 유지한다. */
export function Checkbox({
  checked,
  defaultChecked,
  onChange,
  readOnly,
  label,
  className,
  style,
  ...props
}: Pick<
  ComponentProps<'input'>,
  | 'id'
  | 'checked'
  | 'defaultChecked'
  | 'onChange'
  | 'disabled'
  | 'required'
  | 'name'
  | 'value'
  | 'readOnly'
  | 'className'
  | 'style'
  | 'aria-label'
> & { label?: string }) {
  const [draft, setDraft] = useState(defaultChecked ?? false);

  const classes = [styles.root, props.disabled && styles.disabled, className];

  return (
    <label
      className={classes.filter(Boolean).join(' ')}
      style={style}>
      <input
        {...props}
        type='checkbox'
        aria-label={
          label ? undefined : (props['aria-label'] ?? props.name ?? '선택')
        }
        aria-readonly={readOnly || undefined}
        className={styles.box}
        checked={checked ?? draft}
        onChange={(event) => {
          // 읽기 전용이면 제어값을 바꾸지 않아 React가 원래 상태로 되돌린다.
          if (readOnly) return;
          setDraft(event.target.checked);
          onChange?.(event);
        }}
      />
      {label && <span>{label}</span>}
    </label>
  );
}
