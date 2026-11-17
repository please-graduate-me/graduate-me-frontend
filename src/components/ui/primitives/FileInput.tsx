import { useEffect, useId, useRef, useState } from 'react';
import * as buttonStyles from '@/lib/styles/button.css';
import * as fieldStyles from '@/lib/styles/field.css';
import * as styles from './FileInput.css';
import { Icon } from './Icon';

type Files = File | File[] | null;

/** 바이트 수를 읽기 쉬운 단위로 바꾼다. */
function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024)
    return `${Math.round((bytes / 1024 / 1024) * 10) / 10}MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)}KB`;

  return `${bytes}B`;
}

/** accept 형식과 최대 크기를 넘는 파일을 거르고 거른 이유를 모은다. */
function validate(files: File[], accept?: string, maxSize?: number) {
  const types = accept?.split(',').map((type) => type.trim().toLowerCase());
  const errors: string[] = [];

  const valid = files.filter((file) => {
    const matches =
      !types ||
      types.some((type) =>
        type.startsWith('.')
          ? file.name.toLowerCase().endsWith(type)
          : type.endsWith('/*')
            ? file.type.startsWith(type.slice(0, -1))
            : file.type.toLowerCase() === type
      );

    if (!matches)
      errors.push(`"${file.name}"은(는) 허용되지 않는 파일 형식입니다.`);
    else if (maxSize !== undefined && file.size > maxSize)
      errors.push(
        `"${file.name}"이(가) ${formatSize(maxSize)} 제한을 초과합니다.`
      );

    return matches && (maxSize === undefined || file.size <= maxSize);
  });

  return { valid, errors };
}

/** 클릭·키보드·끌어 놓기로 파일을 고르고 형식과 크기를 미리 검사해 거른 이유를 알린다. */
export function FileInput({
  id,
  label,
  isLabelHidden = false,
  mode = 'input',
  accept,
  maxSize,
  value,
  isMultiple = false,
  isDisabled = false,
  isRequired = false,
  description,
  placeholder,
  className,
  onChange,
}: {
  id?: string;
  label: string;
  isLabelHidden?: boolean;
  mode?: 'dropzone' | 'input';
  accept?: string;
  maxSize?: number;
  value: Files;
  isMultiple?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  description?: string;
  placeholder?: string;
  className?: string;
  onChange: (files: Files) => void;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const files = value === null ? [] : Array.isArray(value) ? value : [value];

  // 상위가 선택을 비우면 같은 파일을 다시 골라도 change가 발생하도록 입력값도 비운다.
  useEffect(() => {
    if (!files.length && input.current) input.current.value = '';
  }, [files.length]);

  function select(list: File[]) {
    if (isDisabled) return;
    const { valid, errors } = validate(list, accept, maxSize);

    setError(errors.length ? errors.join(' ') : null);
    if (!valid.length && input.current) input.current.value = '';
    onChange(valid.length ? (isMultiple ? valid : valid[0]) : null);
  }

  const limits = [
    accept &&
      accept
        .split(',')
        .map((type) => type.trim().replace(/^\./, '').toUpperCase())
        .filter((type) => !type.includes('/'))
        .join(', '),
    maxSize !== undefined && `최대 ${formatSize(maxSize)}`,
  ]
    .filter(Boolean)
    .join(' · ');

  const hint = description ?? limits;

  return (
    <div className={[fieldStyles.field, className].filter(Boolean).join(' ')}>
      {!isLabelHidden && (
        <label
          htmlFor={inputId}
          className={fieldStyles.label}>
          {label}
        </label>
      )}
      <div
        className={`${styles.zone} ${styles.mode[mode]}`}
        data-dragging={dragging || undefined}
        data-invalid={error ? '' : undefined}
        data-disabled={isDisabled || undefined}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!isDisabled) setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          // 안쪽 요소로 옮겨 갈 때 생기는 이탈은 무시한다.
          if (!event.currentTarget.contains(event.relatedTarget as Node | null))
            setDragging(false);
        }}
        onDrop={(event) => {
          // 브라우저 기본 처리는 accept를 검사하지 않으므로 직접 받아 검사한다.
          event.preventDefault();
          setDragging(false);
          select(Array.from(event.dataTransfer.files));
        }}>
        <input
          ref={input}
          id={inputId}
          type='file'
          accept={accept}
          multiple={isMultiple}
          disabled={isDisabled}
          aria-label={isLabelHidden ? label : undefined}
          aria-required={isRequired || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [hint && hintId, error && errorId].filter(Boolean).join(' ') ||
            undefined
          }
          className={styles.input}
          onChange={(event) => select(Array.from(event.target.files ?? []))}
        />
        <Icon
          name='upload'
          size={mode === 'dropzone' ? 28 : 20}
          className={styles.icon}
        />
        <span className={styles.text}>
          <span className={styles.primary}>
            {files.length
              ? files.map((file) => file.name).join(', ')
              : dragging
                ? '여기에 파일을 놓으세요'
                : (placeholder ??
                  (mode === 'dropzone'
                    ? '파일을 끌어 놓거나 눌러서 선택하세요'
                    : '파일 선택'))}
          </span>
          {hint && (
            <span
              id={hintId}
              className={styles.secondary}>
              {hint}
            </span>
          )}
        </span>
        {files.length > 0 && !isDisabled && (
          <button
            type='button'
            aria-label={`${label} 지우기`}
            className={[
              buttonStyles.base,
              buttonStyles.variant.ghost,
              buttonStyles.iconOnly.medium,
              styles.clear,
            ].join(' ')}
            onClick={() => {
              setError(null);
              if (input.current) input.current.value = '';
              onChange(null);
            }}>
            <Icon
              name='x'
              size={18}
            />
          </button>
        )}
      </div>
      {error && (
        <p
          id={errorId}
          role='alert'
          className={fieldStyles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
