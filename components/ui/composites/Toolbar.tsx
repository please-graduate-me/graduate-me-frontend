'use client';
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import * as styles from './Toolbar.css';

const focusable =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** 좌우 화살표와 Home, End 키로 도구 사이 초점을 옮긴다. */
function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
  // 입력칸 안의 화살표는 글자 커서 이동이므로 가로채지 않는다.
  if ((event.target as HTMLElement).closest('input, textarea, select')) return;

  const items = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>(focusable)
  );

  const index = items.indexOf(document.activeElement as HTMLElement);

  const next =
    event.key === 'ArrowRight'
      ? items[(index + 1) % items.length]
      : event.key === 'ArrowLeft'
        ? items[(index - 1 + items.length) % items.length]
        : event.key === 'Home'
          ? items[0]
          : event.key === 'End'
            ? items[items.length - 1]
            : undefined;

  if (!next) return;
  event.preventDefault();
  next.focus();
}

/** 관련 도구를 toolbar 역할로 묶고 앞쪽과 뒤쪽 묶음으로 나눠 배치한다. */
export function Toolbar({
  label,
  startContent,
  endContent,
  className,
  onKeyDown,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  label: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
}) {
  return (
    <div
      role='toolbar'
      aria-label={label}
      {...props}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!event.defaultPrevented) moveFocus(event);
      }}
      className={className ? `${styles.root} ${className}` : styles.root}>
      {startContent != null && (
        <div className={styles.group}>{startContent}</div>
      )}
      {endContent != null && (
        <div className={`${styles.group} ${styles.end}`}>{endContent}</div>
      )}
    </div>
  );
}
