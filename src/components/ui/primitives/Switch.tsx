import { useState, type ComponentProps } from 'react';
import * as styles from './Switch.css';

/** 네이티브 체크 상자를 switch 역할로 알리고 초기값만 받은 상태도 제어 상태로 유지하며 큰 크기를 고를 수 있다. */
export function Switch({
  checked,
  defaultChecked,
  onChange,
  readOnly,
  label,
  size = 'medium',
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
> & { label?: string; size?: 'medium' | 'large' }) {
  const [draft, setDraft] = useState(defaultChecked ?? false);

  const classes = [styles.root, props.disabled && styles.disabled, className];

  return (
    <label
      className={classes.filter(Boolean).join(' ')}
      style={style}>
      <input
        {...props}
        type='checkbox'
        role='switch'
        aria-label={
          label ? undefined : (props['aria-label'] ?? props.name ?? '선택')
        }
        aria-readonly={readOnly || undefined}
        className={
          size === 'large' ? `${styles.track} ${styles.large}` : styles.track
        }
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
