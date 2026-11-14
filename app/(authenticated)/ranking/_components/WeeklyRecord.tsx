'use client';
import { Card } from '@astryxdesign/core/Card';
import { Heading } from '@astryxdesign/core/Heading';
import { ProgressBar } from '@astryxdesign/core/ProgressBar';
import { Text } from '@astryxdesign/core/Text';
import type { GrowthSummary } from '@/domains/growth/model/contracts';
import { videoPaths } from '@/domains/videos/config/paths';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import * as styles from './WeeklyRecord.css';

/** 이번 주 수치와 다음 레벨까지 남은 XP를 실제 성장 기록으로만 보여 준다. */
export function WeeklyRecord({
  summary,
  myRank,
}: {
  summary: GrowthSummary;
  myRank?: number;
}) {
  const done = Math.min(summary.dailyCompleted, summary.dailyGoal);
  // 오늘 XP는 목표 보너스를 빼고 집계되므로 기본 한도와 바로 비교할 수 있다.
  const todayLeft = Math.max(0, summary.dailyLimit - summary.todayXp);

  const tiles = [
    { label: '이번 주 XP', value: `${summary.weeklyXp}` },
    { label: '이번 주 순위', value: myRank ? `${myRank}위` : '-' },
    { label: '오늘 XP', value: `${summary.todayXp} / ${summary.dailyLimit}` },
    { label: '목표 달성 연속', value: `${summary.streak}일` },
  ];

  const hint = !summary.dailyGoalReached
    ? `학습 ${summary.dailyGoal - done}개를 더 하면 오늘 목표를 채워요.`
    : todayLeft
      ? `오늘 학습 XP를 ${todayLeft} XP 더 받을 수 있어요.`
      : '오늘 받을 수 있는 학습 XP를 모두 모았어요.';

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
            누적 {summary.totalXp} XP · 이번 주 {summary.weeklyXp} XP
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
        <p className={styles.goal}>
          <span className={styles.goalLabel}>다음 레벨까지</span>{' '}
          <span className={styles.goalValue}>
            {summary.levelTarget - summary.levelXp} XP
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
        <div className={styles.action}>
          <ButtonLink href={videoPaths.library}>지금 학습하기</ButtonLink>
        </div>
      </div>
    </section>
  );
}
