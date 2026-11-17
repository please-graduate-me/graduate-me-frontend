import { useId } from 'react';
import * as styles from './ProgressBar.css';
import { VisuallyHidden } from './VisuallyHidden';

/** 진행 값을 청록 막대로 표시하고 progressbar 역할과 값 범위를 보조 기술에 알린다. */
export function ProgressBar({
  label,
  isLabelHidden = false,
  value,
  max = 100,
  className,
  'aria-label': ariaLabel,
}: {
  label: string;
  isLabelHidden?: boolean;
  value: number;
  max?: number;
  className?: string;
  'aria-label'?: string;
}) {
  const labelId = useId();
  // 총량이 0인 자료도 있어 나눗셈과 aria 값이 깨지지 않게 최소 1로 둔다.
  const safeMax = max > 0 ? max : 1;
  const current = Math.min(Math.max(value, 0), safeMax);

  return (
    <div className={className ? `${styles.root} ${className}` : styles.root}>
      {isLabelHidden ? (
        <VisuallyHidden id={labelId}>{label}</VisuallyHidden>
      ) : (
        <span
          id={labelId}
          className={styles.label}>
          {label}
        </span>
      )}
      <div
        role='progressbar'
        // 호출부가 따로 준 접근성 이름은 화면 이름보다 구체적이므로 우선한다.
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : labelId}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={current}
        className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${(current / safeMax) * 100}%` }}
        />
      </div>
    </div>
  );
}
