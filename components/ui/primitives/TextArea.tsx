'use client';
import { useId, useState, type ComponentProps } from 'react';
import * as styles from '@/lib/styles/field.css';
import { FieldLabel } from './FieldLabel';

/** 네이티브 여러 줄 입력에 라벨을 붙이고 초기값만 받은 필드도 제어 상태로 유지한다. */
export function TextArea({
  id,
  value,
  defaultValue,
  onChange,
  className,
  style,
  label,
  labelSize,
  hasRequiredTag,
  ...props
}: Pick<
  ComponentProps<'textarea'>,
  | 'id'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'disabled'
  | 'readOnly'
  | 'required'
  | 'name'
  | 'spellCheck'
  | 'className'
  | 'style'
  | 'aria-label'
  | 'maxLength'
  | 'placeholder'
  | 'onBlur'
  | 'ref'
  | 'autoComplete'
  | 'autoCorrect'
  | 'autoCapitalize'
  | 'onKeyDown'
  | 'rows'
> & { 'data-answer'?: boolean } & {
  label?: string;
  labelSize?: 'medium' | 'large';
  hasRequiredTag?: boolean;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [draft, setDraft] = useState(String(defaultValue ?? ''));

  return (
    <div
      className={[styles.field, className].filter(Boolean).join(' ')}
      style={style}>
      {label && (
        <FieldLabel
          htmlFor={inputId}
          size={labelSize}
          hasRequiredTag={hasRequiredTag}>
          {label}
        </FieldLabel>
      )}
      <textarea
        {...props}
        id={inputId}
        aria-label={
          label
            ? undefined
            : (props['aria-label'] ?? props.placeholder ?? props.name ?? '내용')
        }
        className={`${styles.control} ${styles.multiline}`}
        value={String(value ?? draft)}
        onChange={(event) => {
          setDraft(event.target.value);
          onChange?.(event);
        }}
      />
    </div>
  );
}
