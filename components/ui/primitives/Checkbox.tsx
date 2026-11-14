'use client';
import { CheckboxInput as AstryxControl } from '@astryxdesign/core/CheckboxInput';
import { useState, type ComponentProps } from 'react';

/** 기존 체크 상태와 입력 이벤트를 Astryx Checkbox에 연결한다. */
export function Checkbox({
  checked,
  defaultChecked,
  onChange,
  disabled,
  required,
  name,
  value: _value,
  readOnly,
  label,
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

  return (
    <AstryxControl
      {...props}
      label={label ?? props['aria-label'] ?? name ?? '선택'}
      isLabelHidden={!label}
      htmlName={name}
      value={checked ?? draft}
      isDisabled={disabled}
      isRequired={required}
      {...{ required }}
      {...(_value === undefined ? {} : { 'data-form-value': String(_value) })}
      isReadOnly={readOnly}
      onChange={(next, event) => {
        setDraft(next);
        onChange?.(event);
      }}
    />
  );
}
