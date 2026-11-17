import { Card } from '@/components/ui/primitives/Card';
import { Heading } from '@/components/ui/primitives/Heading';
import { ProgressBar } from '@/components/ui/primitives/ProgressBar';
import { Text } from '@/components/ui/primitives/Text';
import { useEffect, useState } from 'react';
import { getGrowth, getLeaderboard } from '@/domains/growth/api/growth';
import { rewardEventName } from '@/domains/growth/lib/rewardEvents';
import type {
  GrowthSummary,
  Leaderboard,
} from '@/domains/growth/model/contracts';
import { Button } from '@/components/ui/primitives/Button';
import { Icon } from '@/components/ui/primitives/Icon';
import { MiniRanking } from './MiniRanking';
import { GrowthCardWeek } from './GrowthCardWeek';
import * as styles from './GrowthCard.css';

const numberFormat = new Intl.NumberFormat('ko-KR');

/** 실제 지급 원장의 연속 학습과 요일별 기록, 레벨, 이번 주 리그를 홈 왼쪽 열에서 이어 볼 수 있게 한다. */
export function GrowthCard() {
  const [value, setValue] = useState<GrowthSummary | null>(null);
  const [board, setBoard] = useState<Leaderboard | null>(null);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    let serial = 0;

    async function refresh() {
      const request = ++serial;

      // 순위는 보조 정보라 실패해도 성장 카드는 그대로 보여 준다.
      const [growth, ranks] = await Promise.allSettled([
        getGrowth(),
        getLeaderboard(),
      ]);

      if (!active || request !== serial) return;

      if (growth.status === 'fulfilled') {
        setValue(growth.value);
        setError('');
      } else setError((growth.reason as Error).message);

      setBoard(ranks.status === 'fulfilled' ? ranks.value : null);
    }

    void refresh();
    window.addEventListener(rewardEventName, refresh);

    return () => {
      active = false;
      window.removeEventListener(rewardEventName, refresh);
    };
  }, [reload]);

  const remaining = value
    ? Math.max(0, value.dailyGoal - value.dailyCompleted)
    : 0;

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
              <Text
                weight='bold'
                color='secondary'
                size='sm'>
                일 연속
              </Text>
            </div>
            <Text
              as='p'
              display='block'
              type='supporting'>
              {value.dailyGoalReached || remaining === 0 ? (
                '오늘 목표를 달성했어요! 연속 기록이 이어져요.'
              ) : (
                <>
                  오늘 구절{' '}
                  <strong className={styles.emphasis}>{remaining}개</strong>를
                  학습하면 연속 기록이 이어져요.
                </>
              )}
            </Text>
            <GrowthCardWeek days={value.weekDays} />
          </Card>
          <Card className={styles.card}>
            <div className={styles.row}>
              <Heading
                level={2}
                className={styles.cardTitle}>
                레벨 {value.level}
              </Heading>
              <Text
                isNumeric
                weight='semibold'
                color='secondary'
                className={styles.levelXp}>
                {numberFormat.format(value.levelXp)} /{' '}
                {numberFormat.format(value.levelTarget)} XP
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
              type='supporting'
              className={styles.levelXp}>
              다음 레벨까지{' '}
              {numberFormat.format(
                Math.max(0, value.levelTarget - value.levelXp)
              )}{' '}
              XP 남았어요
            </Text>
          </Card>
          <MiniRanking
            summary={value}
            board={board}
          />
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
