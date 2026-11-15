'use client';
import type { ComponentProps } from 'react';
import * as buttonStyles from '@/lib/styles/button.css';
import * as styles from './AnswerChip.css';
import { VisuallyHidden } from './VisuallyHidden';

const statusLabels = { correct: '정답', incorrect: '오답' } as const;

/** 빈칸 보기·단어 타일처럼 누르면 내려앉는 선택 칩이며 채점 결과를 색과 숨은 글자로 함께 알린다. */
export function AnswerChip({
  isSelected = false,
  status,
  className,
  children,
  ...props
}: Omit<ComponentProps<'button'>, 'aria-pressed'> & {
  isSelected?: boolean;
  status?: 'correct' | 'incorrect' | 'dimmed';
}) {
  const classes = [
    buttonStyles.raised,
    styles.chip,
    status && styles.status[status],
    className,
  ];

  return (
    <button
      type='button'
      {...props}
      aria-pressed={isSelected}
      data-status={status}
      className={classes.filter(Boolean).join(' ')}>
      {children}
      {(status === 'correct' || status === 'incorrect') && (
        <VisuallyHidden>, {statusLabels[status]}</VisuallyHidden>
      )}
    </button>
  );
}
