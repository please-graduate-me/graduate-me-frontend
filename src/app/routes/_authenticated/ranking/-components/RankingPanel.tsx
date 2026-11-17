import { Card } from '@/components/ui/primitives/Card';

import { List } from '@/components/ui/composites/List';
import { ListItem } from '@/components/ui/composites/ListItem';

import { contentLabel } from '@/components/ui/primitives/contentLabel';
import { Banner } from '@/components/ui/composites/Banner';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { Link } from '@/components/ui/primitives/Link';
import { useId, useState } from 'react';
import { remainingLabel } from '@/domains/growth/lib/league';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { Collapsible } from '@/components/ui/composites/Collapsible';
import {
  getGrowth,
  getLeaderboard,
  updateGrowthPreferences,
} from '@/domains/growth/api/growth';
import type {
  GrowthSummary,
  Leaderboard,
} from '@/domains/growth/model/contracts';
import { Button } from '@/components/ui/primitives/Button';
import { Input } from '@/components/ui/primitives/Input';
import { Checkbox } from '@/components/ui/primitives/Checkbox';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import * as styles from '@/lib/styles/workspace.css';
import { LeaderboardList } from './LeaderboardList';
import { LeagueHero } from './LeagueHero';
import * as rankingStyles from './RankingPanel.css';
import { WeeklyRecord } from './WeeklyRecord';

/** 실명 대신 공개 닉네임으로 참여하며 공동 순위와 내 위치를 구분한다. */
export function RankingPanel({
  initial,
  initialLeaderboard,
}: {
  initial: GrowthSummary;
  initialLeaderboard: Leaderboard;
}) {
  const [summary, setSummary] = useState(initial);
  const [leaderboard, setLeaderboard] = useState(initialLeaderboard);
  const [nickname, setNickname] = useState(initial.nickname);
  const [participating, setParticipating] = useState(initial.participating);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const boardTitleId = useId();

  async function refresh() {
    setBusy(true);
    setError('');
    setMessage('');

    try {
      const [growth, ranks] = await Promise.all([
        getGrowth(),
        getLeaderboard(),
      ]);

      setSummary(growth);
      setLeaderboard(ranks);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    setMessage('');

    try {
      const growth = await updateGrowthPreferences(
        nickname.trim(),
        participating
      );

      setSummary(growth);
      setNickname(growth.nickname);
      setParticipating(growth.participating);

      setMessage(
        growth.participating
          ? '공개 닉네임으로 랭킹에 참여했어요.'
          : '랭킹 공개를 해제했어요. 내 XP와 레벨은 유지돼요.'
      );

      setLeaderboard(await getLeaderboard());
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const league = leaderboard.league;
  const remaining = remainingLabel(leaderboard.daysLeft, leaderboard.hoursLeft);

  return (
    <div className={rankingStyles.root}>
      <div className={rankingStyles.main}>
        <LeagueHero
          league={league}
          tier={league?.tier ?? summary.tier}
          remaining={remaining}
        />
        <section
          className={rankingStyles.board}
          aria-labelledby={boardTitleId}>
          <div className={rankingStyles.boardHeader}>
            <div className={rankingStyles.boardTitle}>
              <Heading
                level={2}
                id={boardTitleId}>
                이번 주 리그 순위
              </Heading>
              <Text
                as='p'
                display='block'
                color='secondary'>
                {league?.joined
                  ? `${league.size} / ${league.groupLimit}명 · `
                  : ''}
                매주 월요일 00:00 정산 (한국 시간)
              </Text>
            </div>
            <Button
              variant='secondary'
              disabled={busy}
              onClick={() => void refresh()}>
              현재 순위 새로 조회
            </Button>
          </div>
          {!league ? (
            <EmptyState
              title='지금은 랭킹 비참여 상태예요'
              description='참여 설정에서 공개 닉네임으로 참여하면 브론즈 리그부터 시작해요. 개인 XP와 레벨은 참여와 관계없이 계속 쌓여요.'
              icon='shield'>
              <ButtonLink
                href='#ranking-settings'
                variant='secondary'>
                참여 설정으로 이동
              </ButtonLink>
            </EmptyState>
          ) : !league.joined ? (
            <EmptyState
              title='이번 주 첫 걸음을 기다리고 있어요'
              description='이번 주 첫 XP를 쌓으면 같은 등급 참여자와 최대 30명 그룹에 배정돼요.'
              icon='users'
            />
          ) : (
            <LeaderboardList
              label='이번 주 리그 순위'
              items={league.members}
            />
          )}
          <Text
            as='p'
            display='block'
            className={styles.meta}>
            같은 XP는 공동 순위이고 승급·강등은 먼저 도달한 순서로 정해요. XP는
            실력 평가가 아닌 학습 참여 기록이에요.
          </Text>
        </section>
        {leaderboard.items.length > 0 && (
          <Card className={rankingStyles.panel}>
            {/* 시안의 리그 목록과 별개인 전체 순위라 기본으로 접어 둔다. */}
            <Collapsible
              trigger={<Heading level={2}>전체 참여자 주간 순위</Heading>}
              toggleLabel={{ closed: '펼쳐 보기', open: '접기' }}>
              <LeaderboardList items={leaderboard.items} />
              <Text
                as='p'
                display='block'
                className={styles.meta}>
                리그와 관계없이 모든 참여자 중 상위 20명과 내 주변 순위예요.
              </Text>
            </Collapsible>
          </Card>
        )}
        <Card className={rankingStyles.panel}>
          {/* 시안 본문에 없는 규칙 안내라 기본으로 접어 두고 필요할 때 펼친다. */}
          <Collapsible
            trigger={<Heading level={2}>어떻게 XP를 모으나요?</Heading>}
            toggleLabel={{ closed: '펼쳐 보기', open: '접기' }}>
            <List>
              <ListItem
                label={
                  <>
                    구절 받아쓰기·적용 문제 최초 정답: {summary.rewards.video}{' '}
                    XP, 도움 사용 시 {summary.rewards.assisted} XP
                  </>
                }
              />
              <ListItem
                label={
                  <>
                    전날까지 저장한 표현 자가점검: 같은 표현·원문 하루 1회,{' '}
                    {summary.rewards.review} XP
                  </>
                }
              />
              <ListItem
                label={
                  <>
                    하루 학습 {summary.dailyGoal}개 달성: 보너스{' '}
                    {summary.rewards.dailyBonus} XP
                  </>
                }
              />
              <ListItem
                label={
                  <>
                    하루 기본 학습 XP 한도: {summary.dailyLimit} XP, 목표 보너스
                    별도
                  </>
                }
              />
              <ListItem
                label={
                  <>
                    누적 {summary.levelTarget} XP마다 레벨 상승. 정답 재제출·AI
                    생성·자료 열기는 추가 보상이 없어요.
                  </>
                }
              />
            </List>
            <Text
              as='p'
              display='block'
              className={styles.meta}>
              캐릭터: 한국외국어대학교 부(Boo).{' '}
              <Link
                href='https://www.hufs.ac.kr/hufs/11137/subview.do'
                target='_blank'
                rel='noreferrer'>
                공식 캐릭터 안내
              </Link>
            </Text>
          </Collapsible>
        </Card>
      </div>
      <aside className={rankingStyles.aside}>
        <WeeklyRecord
          summary={summary}
          league={league}
        />
        <Card
          id='ranking-settings'
          className={rankingStyles.panel}>
          <Heading level={2}>랭킹 참여 설정</Heading>
          <Text
            as='p'
            display='block'>
            기본은 비공개예요. 참여하면 이번 주 XP와 공개 닉네임이 보여요.
            실명이나 이메일을 닉네임으로 쓰지 마세요.
          </Text>
          <form
            className={styles.stack}
            onSubmit={(event) => void save(event)}>
            <div className={styles.field}>
              <Input
                label={contentLabel(<>공개 닉네임</>)}
                value={nickname}
                required
                minLength={2}
                maxLength={20}
                disabled={busy}
                placeholder='공개할 별명 2~20자'
                onChange={(event) => setNickname(event.target.value)}
              />
            </div>
            <Text
              as='p'
              display='block'
              className={styles.meta}>
              한글·영문 등 문자, 숫자, 공백과 _ . -를 사용할 수 있어요.
            </Text>
            <div className={styles.row}>
              <Checkbox
                label={contentLabel(<>주간 랭킹에 내 닉네임과 XP 공개</>)}
                checked={participating}
                disabled={busy}
                onChange={(event) => setParticipating(event.target.checked)}
              />
            </div>
            <Button disabled={busy}>참여 설정 저장</Button>
          </form>
          {message && (
            <Text
              as='p'
              display='block'
              role='status'>
              {message}
            </Text>
          )}
          {error && (
            <Banner
              status='error'
              title='확인이 필요해요'
              role='alert'>
              {error}
            </Banner>
          )}
        </Card>
      </aside>
    </div>
  );
}
