'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getGrowth } from '@/domains/growth/api/growth';
import { rewardEventName } from '@/domains/growth/lib/rewardEvents';
import type { GrowthSummary } from '@/domains/growth/model/contracts';
import { Button } from '@/components/ui/primitives/Button';
import * as styles from './GrowthCard.css';

/** 실제 지급 원장의 성장과 오늘 목표를 홈에서 이어 볼 수 있게 한다. */
export function GrowthCard() {
  const [value, setValue] = useState<GrowthSummary | null>(null);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    let serial = 0;

    async function refresh() {
      const request = ++serial;

      try {
        const data = await getGrowth();

        if (active && request === serial) {
          setValue(data);
          setError('');
        }
      } catch (error) {
        if (active && request === serial) setError((error as Error).message);
      }
    }

    void refresh();
    window.addEventListener(rewardEventName, refresh);

    return () => {
      active = false;
      window.removeEventListener(rewardEventName, refresh);
    };
  }, [reload]);

  return (
    <section
      className={styles.card}
      aria-label='나의 학습 성장'>
      <div>
        <span className={styles.eyebrow}>나의 학습 성장</span>
        <h2>
          {value
            ? `레벨 ${value.level} · ${value.totalXp} XP`
            : '성장 기록을 불러오고 있어요'}
        </h2>
        {value && (
          <>
            <progress
              className={styles.progress}
              aria-label='다음 레벨 진행률'
              value={value.levelXp}
              max={value.levelTarget}
            />
            <p>다음 레벨까지 {value.levelTarget - value.levelXp} XP</p>
          </>
        )}
      </div>
      {value && (
        <div>
          <h3>
            {value.dailyGoalReached
              ? '오늘 목표 달성!'
              : `오늘의 목표 ${Math.min(value.dailyCompleted, value.dailyGoal)} / ${value.dailyGoal}`}
          </h3>
          <p>목표를 달성한 날 {value.streak}일 연속</p>
          <p>
            이번 주 {value.weeklyXp} XP · 오늘 {value.todayXp} /{' '}
            {value.dailyLimit} XP
          </p>
        </div>
      )}
      <div>
        <Link
          href='/ranking'
          className={styles.link}>
          주간 랭킹과 보상 규칙 보기 ↗
        </Link>
        <p>XP는 학습 참여 기록이에요.</p>
      </div>
      {error && (
        <div role='alert'>
          <p>{error}</p>
          <Button
            variant='secondary'
            size='small'
            onClick={() => setReload((n) => n + 1)}>
            성장 기록 다시 조회
          </Button>
        </div>
      )}
    </section>
  );
}
