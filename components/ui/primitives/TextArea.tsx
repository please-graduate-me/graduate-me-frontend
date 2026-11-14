'use client';
import { TextArea as AstryxTextArea } from '@astryxdesign/core/TextArea';
import { useState, type ComponentProps } from 'react';

/** 기존 폼의 초기값과 네이티브 입력 이벤트를 Astryx 여러 줄 입력에 연결한다. */
export function TextArea({
  value,
  defaultValue,
  onChange,
  disabled,
  readOnly,
  required,
  name,
  spellCheck,
  className,
  style,
  label,
  autoCorrect,
  autoCapitalize,
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
> & { 'data-answer'?: boolean } & { label?: string }) {
  const [draft, setDraft] = useState(String(defaultValue ?? ''));

  return (
    <AstryxTextArea
      {...props}
      label={
        label ?? props['aria-label'] ?? props.placeholder ?? name ?? '내용'
      }
      isLabelHidden={!label}
      htmlName={name}
      isDisabled={disabled}
      isReadOnly={readOnly}
      isRequired={required}
      {...{ required }}
      hasAutoCorrect={autoCorrect !== 'off'}
      autoCapitalize={
        autoCapitalize === 'off' || autoCapitalize === 'none'
          ? 'none'
          : autoCapitalize === 'words'
            ? 'words'
            : autoCapitalize === 'characters'
              ? 'characters'
              : 'sentences'
      }
      hasSpellCheck={typeof spellCheck === 'boolean' ? spellCheck : undefined}
      containerClassName={className}
      containerStyle={style}
      value={String(value ?? draft)}
      onChange={(next, event) => {
        setDraft(next);
        onChange?.(event);
      }}
    />
  );
}
