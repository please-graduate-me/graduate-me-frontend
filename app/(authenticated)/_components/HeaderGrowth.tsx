'use client';
import { Link } from '@/components/ui/primitives/Link';
import { Icon } from '@/components/ui/primitives/Icon';
import { useGrowthSummary } from './useGrowthSummary';
import * as styles from './HeaderGrowth.css';

const numberFormat = new Intl.NumberFormat('ko-KR');

/** 상단 헤더에서 연속 학습일과 누적 XP를 보여 주고 보상 지급 직후 다시 읽는다. */
export function HeaderGrowth() {
  const value = useGrowthSummary();

  if (!value) return null;

  return (
    <Link
      href='/ranking'
      className={styles.root}
      aria-label={`연속 학습 ${value.streak}일, 누적 ${value.totalXp} XP, 랭킹 보기`}>
      <span className={styles.pill}>
        <span className={styles.streakIcon}>
          <Icon
            name='flame'
            size={16}
          />
        </span>
        {value.streak}
      </span>
      <span className={styles.pill}>
        <span className={styles.xpIcon}>
          <Icon
            name='zap'
            size={16}
          />
        </span>
        {numberFormat.format(value.totalXp)} XP
      </span>
    </Link>
  );
}
