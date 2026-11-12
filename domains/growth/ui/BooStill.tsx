import * as styles from './BooStill.css';

/** 로딩과 실패, 모션 축소 환경에서 동일한 원본 자세를 유지한다. */
export function BooStill() {
  return (
    <span
      className={styles.image}
      aria-hidden='true'
    />
  );
}
