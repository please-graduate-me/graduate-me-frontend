import { Card } from '@/components/ui/primitives/Card';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { Avatar } from '@/components/ui/primitives/Avatar';
import { Icon } from '@/components/ui/primitives/Icon';
import { Link } from '@/components/ui/primitives/Link';
import { daysLeftInWeek } from '@/domains/growth/lib/week';
import {
  membersAroundMe,
  promotionRule,
  remainingLabel,
  tierLabels,
} from '@/domains/growth/lib/league';
import type {
  GrowthSummary,
  Leaderboard,
} from '@/domains/growth/model/contracts';
import { LeagueShield } from '@/domains/growth/ui/LeagueShield';
import * as styles from './MiniRanking.css';

const numberFormat = new Intl.NumberFormat('ko-KR');

/** 홈 왼쪽 열에서 이번 주 리그 등급, 승급 규칙, 남은 기간과 내 앞뒤 순위를 보여 주고 랭킹 화면으로 이어 준다. */
export function MiniRanking({
  summary,
  board,
}: {
  summary: GrowthSummary;
  board: Leaderboard | null;
}) {
  const league = board?.league ?? null;
  // 순위 조회가 실패하면 리그 유무를 알 수 없어 성장 현황의 참여 여부로 대신 판단한다.
  const participating = board ? Boolean(league) : summary.participating;
  const tier = league?.tier ?? summary.tier;
  const rows = league?.joined ? membersAroundMe(league.members) : [];
  // 순위 조회가 실패해도 성장 현황의 주 시작일로 남은 날을 대신 센다.
  const fallbackDays = daysLeftInWeek(summary.weekStart, summary.day);

  const remaining = board
    ? remainingLabel(board.daysLeft, board.hoursLeft)
    : fallbackDays
      ? `${fallbackDays}일 남음`
      : '';

  const meta = [
    league
      ? promotionRule(league.promotionSlots)
      : participating
        ? ''
        : '랭킹 비참여',
    remaining,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Card className={styles.root}>
      <div className={styles.header}>
        <LeagueShield
          tier={tier}
          state={participating ? 'current' : 'locked'}
          size={40}
        />
        <div className={styles.heading}>
          <Heading
            level={2}
            className={styles.title}>
            {participating
              ? `이번 주 ${tierLabels[tier]} 리그`
              : '이번 주 리그'}
          </Heading>
          <Text
            as='p'
            display='block'
            type='supporting'
            className={styles.meta}>
            {meta}
          </Text>
        </div>
        <Link
          href='/ranking'
          aria-label='랭킹 전체 보기'
          className={styles.more}>
          <Icon
            name='chevron-right'
            size={20}
          />
        </Link>
      </div>
      {rows.length > 0 ? (
        <ol
          className={styles.list}
          aria-label='리그 내 주변 순위'>
          {rows.map((row) => (
            <li
              key={row.position}
              className={styles.row}
              data-me={row.isMe || undefined}
              aria-current={row.isMe ? 'true' : undefined}>
              <span className={styles.rank}>{row.rank}</span>
              <Avatar
                name={row.nickname}
                size={28}
                tone={row.isMe ? 'self' : 'auto'}
                tooltip={false}
                aria-hidden
              />
              <span className={styles.name}>{row.nickname}</span>
              <span className={styles.xp}>
                {numberFormat.format(row.xp)} XP
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <Text
          as='p'
          display='block'
          type='supporting'
          className={styles.empty}>
          {league
            ? '이번 주 첫 XP를 쌓으면 리그에 배정되고 내 주변 순위가 보여요.'
            : participating
              ? '리그 순위를 불러오지 못했어요. 랭킹 화면에서 확인해 주세요.'
              : '랭킹 화면의 참여 설정에서 참여하면 주간 리그 순위가 보여요.'}
        </Text>
      )}
    </Card>
  );
}
