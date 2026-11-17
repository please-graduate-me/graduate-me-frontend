import type { ComponentProps } from 'react';
import * as styles from '@/lib/styles/field.css';

/** 문장 속 빈칸을 밑줄형 입력으로 그리며 정답·오답 상태를 색과 aria-invalid로 함께 알린다. */
export function InlineBlank({
  label,
  status,
  width = 150,
  className,
  style,
  ...props
}: Pick<
  ComponentProps<'input'>,
  | 'id'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'onBlur'
  | 'onFocus'
  | 'onKeyDown'
  | 'disabled'
  | 'readOnly'
  | 'name'
  | 'placeholder'
  | 'maxLength'
  | 'autoFocus'
  | 'autoComplete'
  | 'autoCorrect'
  | 'autoCapitalize'
  | 'spellCheck'
  | 'aria-describedby'
  | 'className'
  | 'style'
  | 'ref'
> & {
  label: string;
  status?: 'correct' | 'incorrect';
  width?: number;
}) {
  return (
    <input
      type='text'
      autoComplete='off'
      spellCheck={false}
      {...props}
      aria-label={label}
      aria-invalid={status === 'incorrect' || undefined}
      data-status={status}
      className={[styles.blank, className].filter(Boolean).join(' ')}
      // 빈칸 폭은 정답 길이에 따라 호출부마다 달라 인라인 값으로 전달한다.
      style={{ width, ...style }}
    />
  );
}
