import * as styles from './PlaybackStatus.css';

/** 플레이어의 실제 상태를 영상 밖에서도 글자와 움직임으로 확인하게 한다. */
export function PlaybackStatus({
  playing,
  waiting,
  ready,
  buffering,
  blocked,
  error,
}: {
  playing: boolean;
  waiting: boolean;
  ready: boolean;
  buffering: boolean;
  blocked: boolean;
  error: string;
}) {
  const active = playing && !blocked && !error;

  const label = error
    ? '재생할 수 없음'
    : blocked
      ? '재생 버튼을 눌러 주세요'
      : !ready
        ? '플레이어 준비 중'
        : buffering
          ? '영상 불러오는 중'
          : active
            ? '재생 중'
            : waiting
              ? '다음 재생 대기'
              : '일시정지';

  return (
    <div
      className={`${styles.container} ${active ? styles.active : ''}`}
      role='status'
      aria-live='polite'>
      <span
        className={styles.bars}
        aria-hidden='true'>
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </span>
      <span>{label}</span>
    </div>
  );
}
