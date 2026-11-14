'use client';
import { useId, useState, type ComponentProps } from 'react';
import * as styles from '@/lib/styles/field.css';

type InputChange = {
  target: {
    value: string;
    valueAsNumber: number;
    files: File[] | FileList | null;
  };
  currentTarget: {
    value: string;
    valueAsNumber: number;
    files: File[] | FileList | null;
  };
};

type InputProps = Pick<
  ComponentProps<'input'>,
  | 'id'
  | 'type'
  | 'value'
  | 'defaultValue'
  | 'disabled'
  | 'required'
  | 'readOnly'
  | 'name'
  | 'autoFocus'
  | 'spellCheck'
  | 'className'
  | 'style'
  | 'min'
  | 'max'
  | 'step'
  | 'multiple'
  | 'accept'
  | 'placeholder'
  | 'maxLength'
  | 'minLength'
  | 'aria-label'
  | 'aria-invalid'
  | 'aria-describedby'
  | 'inputMode'
  | 'onBlur'
  | 'onKeyDown'
  | 'autoComplete'
  | 'onFocus'
  | 'autoCorrect'
  | 'autoCapitalize'
> & {
  label?: string;
  onChange?: (event: InputChange) => void;
};

/** 네이티브 입력에 보이는 라벨이나 숨은 접근성 이름을 붙이고 초기값만 받은 필드도 제어 상태로 유지한다. */
export function Input({
  id,
  type = 'text',
  value,
  defaultValue,
  onChange,
  className,
  style,
  label,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [draft, setDraft] = useState(String(defaultValue ?? ''));
  const classes = [styles.control, type === 'search' && styles.search];

  return (
    <div
      className={[styles.field, className].filter(Boolean).join(' ')}
      style={style}>
      {label && (
        <label
          htmlFor={inputId}
          className={styles.label}>
          {label}
        </label>
      )}
      <input
        {...props}
        id={inputId}
        type={type}
        aria-label={
          label
            ? undefined
            : (props['aria-label'] ?? props.placeholder ?? props.name ?? '입력')
        }
        className={classes.filter(Boolean).join(' ')}
        // 파일 선택은 브라우저만 값을 쓸 수 있어 제어하지 않는다.
        {...(type === 'file' ? {} : { value: String(value ?? draft) })}
        onChange={(event) => {
          setDraft(event.target.value);
          onChange?.(event);
        }}
      />
    </div>
  );
}
