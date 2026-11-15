import type { LearningSettings } from '@/domains/users/model/settings';
import * as styles from './ReplayPreview.css';

// 반복이 많아도 미리보기 줄이 넘치지 않도록 앞의 몇 회만 펼쳐 보인다.
const visibleLoops = 3;

/** 현재 반복 설정을 처음 듣기부터 이어지는 칩 흐름으로 그린다. */
export function ReplayPreview({ settings }: { settings: LearningSettings }) {
  const total = settings.replayCount ?? Infinity;
  const shown = Math.min(total, visibleLoops);

  const loops = settings.autoReplay
    ? Array.from({ length: shown }, (_, index) =>
        index === 0
          ? `${settings.replayDelay}초 뒤 반복 1`
          : `반복 ${index + 1}`
      )
    : [];

  if (settings.autoReplay && total > visibleLoops)
    loops.push(Number.isFinite(total) ? `… 반복 ${total}` : '계속 반복');

  return (
    <div
      aria-hidden='true'
      className={styles.preview}>
      <span className={styles.first}>처음 듣기</span>
      {loops.map((loop) => (
        <span
          key={loop}
          className={styles.step}>
          <span className={styles.connector} />
          <span className={styles.loop}>{loop}</span>
        </span>
      ))}
    </div>
  );
}
