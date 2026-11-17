import { bob } from '@/lib/styles/motion.css';
import type { LeagueTier } from '../model/contracts';
import * as styles from './LeagueShield.css';

/** 리그 등급 방패를 현재·거친 등급은 등급 색으로, 잠긴 등급은 회색 자물쇠로 그리는 장식 표지다. */
export function LeagueShield({
  tier,
  state = 'current',
  size = 76,
  animated = false,
}: {
  tier: LeagueTier;
  state?: 'current' | 'achieved' | 'locked';
  size?: number;
  animated?: boolean;
}) {
  const locked = state === 'locked';

  const className = [
    styles.root,
    locked ? styles.locked : styles.tier[tier],
    animated ? bob : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <svg
      aria-hidden='true'
      width={size}
      height={Math.round((size * 86) / 76)}
      viewBox='0 0 76 86'
      className={className}>
      <path
        className={styles.outer}
        d='M8 6h60v40c0 18-14 30-30 36C22 76 8 64 8 46V6z'
      />
      <path
        className={styles.inner}
        d='M16 14h44v31c0 13-10 22-22 27-12-5-22-14-22-27V14z'
      />
      {locked ? (
        <>
          <rect
            className={styles.center}
            x='30'
            y='34'
            width='16'
            height='14'
            rx='3'
          />
          <path
            className={styles.shackle}
            d='M33 34v-4a5 5 0 0 1 10 0v4'
          />
        </>
      ) : (
        <circle
          className={styles.center}
          cx='38'
          cy='40'
          r='11'
        />
      )}
    </svg>
  );
}
