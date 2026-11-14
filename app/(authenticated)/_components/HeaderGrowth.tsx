'use client';
import { useEffect, useState } from 'react';
import { Link } from '@astryxdesign/core/Link';
import { getGrowth } from '@/domains/growth/api/growth';
import { rewardEventName } from '@/domains/growth/lib/rewardEvents';
import type { GrowthSummary } from '@/domains/growth/model/contracts';
import { Icon } from '@/components/ui/primitives/Icon';
import * as styles from './HeaderGrowth.css';

const numberFormat = new Intl.NumberFormat('ko-KR');

/** 상단 헤더에서 연속 학습일과 누적 XP를 보여 주고 보상 지급 직후 다시 읽는다. */
export function HeaderGrowth() {
  const [value, setValue] = useState<GrowthSummary | null>(null);

  useEffect(() => {
    let active = true;
    let serial = 0;

    async function refresh() {
      const request = ++serial;

      try {
        const data = await getGrowth();

        if (active && request === serial) setValue(data);
      } catch {
        // 헤더 수치는 보조 정보라 실패해도 화면 이용을 막지 않고 숨긴다.
        if (active && request === serial) setValue(null);
      }
    }

    void refresh();
    window.addEventListener(rewardEventName, refresh);

    return () => {
      active = false;
      window.removeEventListener(rewardEventName, refresh);
    };
  }, []);

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
