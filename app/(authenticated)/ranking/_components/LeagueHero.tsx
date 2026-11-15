import { Badge } from '@/components/ui/primitives/Badge';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import {
  lastResultLabel,
  leagueTiers,
  nextTier,
  tierLabels,
  tierState,
} from '@/domains/growth/lib/league';
import type { League, LeagueTier } from '@/domains/growth/model/contracts';
import { LeagueShield } from '@/domains/growth/ui/LeagueShield';
import * as styles from './LeagueHero.css';

/** 랭킹 화면 맨 위에서 등급 방패 3개 중 현재 등급을 키워 보여 주고 승급 인원, 남은 기간, 지난주 결과를 알린다. */
export function LeagueHero({
  league,
  tier,
  remaining,
}: {
  league: League | null;
  tier: LeagueTier;
  remaining: string;
}) {
  const next = nextTier(tier);

  return (
    <header className={styles.root}>
      <div className={styles.shields}>
        {leagueTiers.map((item) => {
          const state = tierState(item, tier);
          const current = state === 'current';

          return (
            <LeagueShield
              key={item}
              tier={item}
              state={state}
              size={current ? 76 : 56}
              // 비참여 계정은 리그에 들어가 있지 않으므로 현재 방패도 들썩이지 않는다.
              animated={current && Boolean(league)}
            />
          );
        })}
      </div>
      <Heading level={1}>
        {league ? `${tierLabels[tier]} 리그` : '주간 리그'}
      </Heading>
      <Text
        as='p'
        display='block'
        color='secondary'>
        {league
          ? league.promotionSlots > 0 && next
            ? `상위 ${league.promotionSlots}명이 ${tierLabels[next]} 리그로 올라가요 · `
            : '가장 높은 리그예요 · '
          : '참여하면 같은 등급 최대 30명과 주간 XP를 함께 쌓아요 · '}
        <strong className={styles.remaining}>{remaining}</strong>
      </Text>
      {league && league.demotionSlots > 0 && (
        <Text
          as='p'
          display='block'
          type='supporting'>
          하위 {league.demotionSlots}명은 한 단계 아래 리그로 내려가요.
        </Text>
      )}
      {league?.lastResult && (
        <Badge
          tone={
            league.lastResult.result === 'promoted'
              ? 'success'
              : league.lastResult.result === 'demoted'
                ? 'warning'
                : 'neutral'
          }>
          {lastResultLabel(league.lastResult)}
        </Badge>
      )}
    </header>
  );
}
