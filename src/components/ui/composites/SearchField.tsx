import { useState } from 'react';
import { Button } from '../primitives/Button';
import { Icon } from '../primitives/Icon';
import * as styles from './SearchField.css';

/** 돋보기가 붙은 회색 검색 막대이며 onSubmit이 있으면 검색 폼으로, 없으면 입력 즉시 거르는 검색 영역으로 렌더링한다. */
export function SearchField({
  label,
  value,
  defaultValue = '',
  onChange,
  onSubmit,
  submitLabel = '검색',
  hasSubmitButton = true,
  placeholder,
  name,
  maxLength,
  isDisabled = false,
  className,
}: {
  label: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  submitLabel?: string;
  hasSubmitButton?: boolean;
  placeholder?: string;
  name?: string;
  maxLength?: number;
  isDisabled?: boolean;
  className?: string;
}) {
  const [draft, setDraft] = useState(defaultValue);
  const current = value ?? draft;
  const hasButton = onSubmit !== undefined && hasSubmitButton;

  const classes = [styles.root, hasButton && styles.withSubmit, className];

  const content = (
    <>
      <Icon
        name='search'
        size={18}
        className={styles.icon}
      />
      <input
        type='search'
        name={name}
        aria-label={label}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={isDisabled}
        className={styles.input}
        value={current}
        onChange={(event) => {
          setDraft(event.target.value);
          onChange?.(event.target.value);
        }}
      />
      {hasButton && (
        <Button
          variant='surface'
          shape='rounded'
          disabled={isDisabled}>
          {submitLabel}
        </Button>
      )}
    </>
  );

  if (onSubmit)
    return (
      <form
        role='search'
        aria-label={label}
        className={classes.filter(Boolean).join(' ')}
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(current);
        }}>
        {content}
      </form>
    );

  return (
    <div
      role='search'
      aria-label={label}
      className={classes.filter(Boolean).join(' ')}>
      {content}
    </div>
  );
}
