'use client';
import { Card } from '@/components/ui/primitives/Card';
import { Heading } from '@/components/ui/primitives/Heading';
import { ProgressBar } from '@/components/ui/primitives/ProgressBar';
import { Text } from '@/components/ui/primitives/Text';
import type { GrowthSummary, League } from '@/domains/growth/model/contracts';
import { nextTier, tierLabels } from '@/domains/growth/lib/league';
import { videoPaths } from '@/domains/videos/config/paths';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import * as styles from './WeeklyRecord.css';

const numberFormat = new Intl.NumberFormat('ko-KR');

/** 이번 주 수치와 승급까지 남은 XP(리그 밖이면 다음 레벨까지)를 실제 성장 기록으로만 보여 준다. */
export function WeeklyRecord({
  summary,
  league,
}: {
  summary: GrowthSummary;
  league: League | null;
}) {
  const done = Math.min(summary.dailyCompleted, summary.dailyGoal);
  // 오늘 XP는 목표 보너스를 빼고 집계되므로 기본 한도와 바로 비교할 수 있다.
  const todayLeft = Math.max(0, summary.dailyLimit - summary.todayXp);

  const tiles = [
    { label: '획득 XP', value: numberFormat.format(summary.weeklyXp) },
    {
      label: '학습한 구절',
      value: numberFormat.format(summary.weeklyCompletedItems),
    },
    {
      label: '저장한 표현',
      value: numberFormat.format(summary.weeklySavedExpressions),
    },
    { label: '연속 학습', value: `${summary.streak}일` },
  ];

  const hint = !summary.dailyGoalReached
    ? `학습 ${summary.dailyGoal - done}개를 더 하면 오늘 목표를 채워요.`
    : todayLeft
      ? `오늘 학습 XP를 ${todayLeft} XP 더 받을 수 있어요.`
      : '오늘 받을 수 있는 학습 XP를 모두 모았어요.';

  // 최고 등급이거나 아직 리그에 배정되지 않았으면 승급 대신 레벨 목표를 보여 준다.
  const promotion =
    league?.joined && league.xpToPromotion !== null ? league : null;

  const next = promotion ? nextTier(promotion.tier) : null;

  return (
    <section
      className={styles.root}
      aria-label='개인 성장'>
      <Card className={styles.panel}>
        <Heading level={2}>이번 주 내 기록</Heading>
        <dl className={styles.tiles}>
          {tiles.map((tile) => (
            <div
              key={tile.label}
              className={styles.tile}>
              <dt className={styles.tileLabel}>{tile.label}</dt>
              <dd className={styles.tileValue}>{tile.value}</dd>
            </div>
          ))}
        </dl>
        <div className={styles.level}>
          <Heading level={3}>레벨 {summary.level}</Heading>
          <Text
            as='p'
            display='block'
            color='secondary'>
            누적 {numberFormat.format(summary.totalXp)} XP · 이번 주{' '}
            {numberFormat.format(summary.weeklyXp)} XP
          </Text>
          <ProgressBar
            label='진행 상황'
            isLabelHidden
            aria-label='다음 레벨 진행률'
            value={summary.levelXp}
            max={summary.levelTarget}
          />
        </div>
      </Card>
      <div className={styles.nudge}>
        {promotion ? (
          <>
            <p className={styles.goal}>
              <span className={styles.goalLabel}>
                {promotion.xpToPromotion ? '승급까지' : '지금 승급 구간'}
              </span>{' '}
              <span className={styles.goalValue}>
                {promotion.xpToPromotion
                  ? `${numberFormat.format(promotion.xpToPromotion)} XP`
                  : `${promotion.myRank ?? '-'}위`}
              </span>
            </p>
            <p className={styles.hint}>
              {promotion.xpToPromotion
                ? `구절 ${Math.ceil(promotion.xpToPromotion / summary.rewards.video)}개를 처음 맞히면 승급 구간에 들어가요.`
                : `정산 전까지 자리를 지키면 ${next ? tierLabels[next] : '다음'} 리그로 올라가요.`}
            </p>
          </>
        ) : (
          <>
            <p className={styles.goal}>
              <span className={styles.goalLabel}>다음 레벨까지</span>{' '}
              <span className={styles.goalValue}>
                {numberFormat.format(
                  Math.max(0, summary.levelTarget - summary.levelXp)
                )}{' '}
                XP
              </span>
            </p>
            <Heading
              level={3}
              color='inherit'>
              {summary.dailyGoalReached
                ? '오늘의 목표를 달성했어요!'
                : `오늘 목표 ${done} / ${summary.dailyGoal}`}
            </Heading>
            <p className={styles.hint}>{hint}</p>
          </>
        )}
        <div className={styles.action}>
          <ButtonLink
            href={videoPaths.library}
            size='comfortable'>
            지금 학습하기
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
