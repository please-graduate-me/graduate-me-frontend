'use client';
import {
  DateTimeInput,
  type ISODateTimeString,
} from '@astryxdesign/core/DateTimeInput';
import { FileInput } from '@astryxdesign/core/FileInput';
import { NumberInput } from '@astryxdesign/core/NumberInput';
import { TextInput, type TextInputType } from '@astryxdesign/core/TextInput';
import { useState, type ComponentProps } from 'react';

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

/** 기존 값·파일·폼 계약을 종류별 Astryx 입력에 연결한다. */
export function Input({
  type = 'text',
  value,
  defaultValue,
  onChange,
  disabled,
  required,
  readOnly,
  name,
  autoFocus,
  spellCheck,
  className,
  style,
  min,
  max,
  step,
  multiple,
  accept,
  label,
  autoCorrect,
  autoCapitalize,
  onFocus,
  onBlur,
  onKeyDown,
  ...props
}: InputProps) {
  const [draft, setDraft] = useState(String(defaultValue ?? ''));
  const [files, setFiles] = useState<File | File[] | null>(null);
  const current = String(value ?? draft);

  const accessibleLabel =
    label ?? props['aria-label'] ?? props.placeholder ?? name ?? '입력';

  const common = {
    label: accessibleLabel,
    isLabelHidden: !label,
    isDisabled: disabled,
    isRequired: required,
    required,
    containerClassName: className,
    containerStyle: style,
  };

  const commit = (next: string, selected: File[] | FileList | null = null) => {
    setDraft(next);

    const target = {
      value: next,
      valueAsNumber: next === '' ? NaN : Number(next),
      files: selected,
    };

    onChange?.({ target, currentTarget: target });
  };

  if (type === 'file') {
    return (
      <FileInput
        {...props}
        {...common}
        accept={accept}
        isMultiple={multiple}
        value={files}
        onChange={(next) => {
          setFiles(next);

          const selected =
            next === null ? [] : Array.isArray(next) ? next : [next];

          commit(selected[0]?.name ?? '', selected);
        }}
      />
    );
  }

  if (type === 'number') {
    return (
      <NumberInput
        {...props}
        {...common}
        htmlName={name}
        value={current === '' ? null : Number(current)}
        min={min === undefined ? undefined : Number(min)}
        max={max === undefined ? undefined : Number(max)}
        step={step === undefined || step === 'any' ? undefined : Number(step)}
        isReadOnly={readOnly}
        hasAutoFocus={autoFocus}
        hasClear
        // 숫자 필드는 확정 전에도 입력값을 알려 페이지 이동 같은 기존 blur 동작을 보존한다.
        onInput={(event) => {
          if (event.currentTarget instanceof HTMLInputElement)
            commit(event.currentTarget.value);
        }}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onChange={(next) => commit(next === null ? '' : String(next))}
      />
    );
  }

  if (type === 'datetime-local') {
    // 지역 시각 문자열을 그대로 전달해 과제 마감 시각의 시간대 해석을 유지한다.
    return (
      <>
        <DateTimeInput
          {...props}
          {...common}
          value={dateTimeValue(current)}
          min={dateTimeValue(min)}
          max={dateTimeValue(max)}
          onChange={(next) => commit(next ?? '')}
        />
        {name && (
          <input
            type='hidden'
            name={name}
            value={current}
            disabled={disabled}
          />
        )}
      </>
    );
  }

  const textType: TextInputType =
    type === 'email' ||
    type === 'password' ||
    type === 'search' ||
    type === 'tel' ||
    type === 'url'
      ? (type as TextInputType)
      : 'text';

  return (
    <TextInput
      {...props}
      {...common}
      type={textType}
      htmlName={name}
      value={current}
      isReadOnly={readOnly}
      hasAutoFocus={autoFocus}
      hasSpellCheck={typeof spellCheck === 'boolean' ? spellCheck : undefined}
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
      onKeyDown={onKeyDown}
      onBlur={
        onBlur
          ? (event) => onBlur(event as React.FocusEvent<HTMLInputElement>)
          : undefined
      }
      onFocus={
        onFocus
          ? (event) => onFocus(event as React.FocusEvent<HTMLInputElement>)
          : undefined
      }
      onChange={(next, event) => {
        setDraft(next);
        onChange?.(event);
      }}
    />
  );
}

function dateTimeValue(
  value: string | number | undefined
): ISODateTimeString | undefined {
  if (
    value === undefined ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(String(value))
  )
    return undefined;

  return String(value) as ISODateTimeString;
}
