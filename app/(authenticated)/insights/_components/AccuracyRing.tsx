import * as styles from './AccuracyRing.css';

const radius = 38;
const circumference = 2 * Math.PI * radius;

/** 도움 없는 시도의 정답률을 고리 그림으로 보여 주고 기록이 없으면 빈 고리를 둔다. */
export function AccuracyRing({ accuracy }: { accuracy: number | null }) {
  const percent = accuracy === null ? null : Math.round(accuracy);
  const filled = ((percent ?? 0) / 100) * circumference;

  return (
    <svg
      role='img'
      aria-label={
        percent === null ? '정답률 계산할 기록 없음' : `정답률 ${percent}%`
      }
      width='96'
      height='96'
      viewBox='0 0 96 96'
      className={styles.root}>
      <circle
        cx='48'
        cy='48'
        r={radius}
        fill='none'
        strokeWidth='10'
        className={styles.track}
      />
      <circle
        cx='48'
        cy='48'
        r={radius}
        fill='none'
        strokeWidth='10'
        strokeLinecap='round'
        strokeDasharray={`${filled.toFixed(1)} ${circumference.toFixed(1)}`}
        transform='rotate(-90 48 48)'
        className={styles.value}
        // 0%일 때 둥근 선 끝만 점으로 남지 않게 채운 선을 그리지 않는다.
        visibility={filled > 0 ? undefined : 'hidden'}
      />
      <text
        x='48'
        y='54'
        textAnchor='middle'
        className={styles.label}>
        {percent === null ? '-' : `${percent}%`}
      </text>
    </svg>
  );
}
