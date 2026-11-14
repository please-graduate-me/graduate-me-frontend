'use client';
import { Card } from '@/components/ui/primitives/Card';
import { Heading } from '@/components/ui/primitives/Heading';
import { ProgressBar } from '@/components/ui/primitives/ProgressBar';
import { Text } from '@/components/ui/primitives/Text';
import { useEffect, useState } from 'react';
import { Link } from '@/components/ui/primitives/Link';
import { getGrowth } from '@/domains/growth/api/growth';
import { rewardEventName } from '@/domains/growth/lib/rewardEvents';
import type { GrowthSummary } from '@/domains/growth/model/contracts';
import { Button } from '@/components/ui/primitives/Button';
import { Icon } from '@/components/ui/primitives/Icon';
import * as styles from './GrowthCard.css';

/** 실제 지급 원장의 연속 학습, 레벨, 주간 XP를 홈 왼쪽 열에서 이어 볼 수 있게 한다. */
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
      className={styles.stack}
      aria-label='나의 학습 성장'>
      {value ? (
        <>
          <Card className={styles.card}>
            <div className={styles.streak}>
              <span className={styles.bigNumber}>{value.streak}</span>
              <span className={styles.flame}>
                <Icon
                  name='flame'
                  size={22}
                />
              </span>
              <Text weight='bold'>일 연속</Text>
            </div>
            <Text
              as='p'
              display='block'>
              {value.dailyGoalReached
                ? '오늘 목표를 달성했어요!'
                : `오늘의 목표 ${Math.min(value.dailyCompleted, value.dailyGoal)} / ${value.dailyGoal}`}
            </Text>
            <ProgressBar
              label='오늘의 목표 진행률'
              isLabelHidden
              value={Math.min(value.dailyCompleted, value.dailyGoal)}
              max={value.dailyGoal}
            />
          </Card>
          <Card className={styles.card}>
            <div className={styles.row}>
              <Heading level={2}>레벨 {value.level}</Heading>
              <Text color='secondary'>
                {value.levelXp} / {value.levelTarget} XP
              </Text>
            </div>
            <ProgressBar
              label='다음 레벨 진행률'
              isLabelHidden
              value={value.levelXp}
              max={value.levelTarget}
            />
            <Text
              as='p'
              display='block'
              color='secondary'>
              다음 레벨까지 {value.levelTarget - value.levelXp} XP
            </Text>
          </Card>
          <Card className={styles.card}>
            <Heading level={2}>이번 주 {value.weeklyXp} XP</Heading>
            <Text
              as='p'
              display='block'
              color='secondary'>
              오늘 {value.todayXp} / {value.dailyLimit} XP · XP는 학습 참여
              기록이에요.
            </Text>
            <Link
              href='/ranking'
              className={styles.link}>
              주간 랭킹과 보상 규칙 보기
            </Link>
          </Card>
        </>
      ) : (
        !error && (
          <Card className={styles.card}>
            <Text
              as='p'
              display='block'
              role='status'>
              성장 기록을 불러오고 있어요.
            </Text>
          </Card>
        )
      )}
      {error && (
        <Card
          className={styles.card}
          role='alert'>
          <Text
            as='p'
            display='block'>
            {error}
          </Text>
          <Button
            variant='secondary'
            size='small'
            onClick={() => setReload((n) => n + 1)}>
            성장 기록 다시 조회
          </Button>
        </Card>
      )}
    </section>
  );
}
