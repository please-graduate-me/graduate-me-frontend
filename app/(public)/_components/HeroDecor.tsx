import { GraduationStamp } from '../../_components/GraduationStamp';
import * as styles from './HeroDecor.css';

/** 소개 첫 화면 주변에 단어 카드, 음성 파형, 졸업 도장을 띄운다. */
export function HeroDecor() {
  return (
    <div
      aria-hidden='true'
      className={styles.root}>
      <span className={styles.item.wordLeft}>happen to</span>
      <span className={styles.item.wordRight}>available</span>
      <span className={styles.item.wave}>
        <span className={styles.bars.first} />
        <span className={styles.bars.second} />
        <span className={styles.bars.third} />
        <span className={styles.bars.fourth} />
        <span className={styles.bars.fifth} />
      </span>
      <span className={styles.item.stamp}>
        <GraduationStamp size={132} />
      </span>
    </div>
  );
}
