import type { AriaAttributes } from 'react';
import * as styles from './StatusDot.css';

/** 상태를 색 원으로 표시하고 같은 의미를 보조 기술에 이름으로 전달한다. */
export function StatusDot({
  variant,
  label,
  isPulsing = false,
  className,
  ...props
}: AriaAttributes & {
  variant: keyof typeof styles.variant;
  label: string;
  isPulsing?: boolean;
  className?: string;
}) {
  const classes = [
    styles.root,
    styles.variant[variant],
    isPulsing && styles.pulsing,
    className,
  ];

  return (
    <span
      role='img'
      aria-label={label}
      {...props}
      className={classes.filter(Boolean).join(' ')}
    />
  );
}
