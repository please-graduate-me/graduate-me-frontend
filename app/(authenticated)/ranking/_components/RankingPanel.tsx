'use client';
import { useState } from 'react';
import { BooMascot } from '@/domains/growth/ui/BooMascot';
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
import * as rankingStyles from './RankingPanel.css';

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

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div>
          <h1>부와 함께, 한 걸음 더</h1>
          <p className={styles.description}>
            어제의 나보다 조금 더. 꾸준히 쌓은 학습을 함께 응원해요.
          </p>
        </div>
        <Button
          variant='secondary'
          disabled={busy}
          onClick={() => void refresh()}>
          현재 순위 새로 조회
        </Button>
      </div>
      <section
        className={rankingStyles.hero}
        aria-label='개인 성장'>
        <BooMascot size={128} />
        <div>
          <h2>레벨 {summary.level}</h2>
          <p>
            누적 {summary.totalXp} XP · 이번 주 {summary.weeklyXp} XP
          </p>
          <progress
            className={rankingStyles.progress}
            aria-label='다음 레벨 진행률'
            value={summary.levelXp}
            max={summary.levelTarget}
          />
          <p>다음 레벨까지 {summary.levelTarget - summary.levelXp} XP</p>
        </div>
        <div>
          <h3>
            {summary.dailyGoalReached
              ? '오늘의 목표를 달성했어요!'
              : `오늘 목표 ${Math.min(summary.dailyCompleted, summary.dailyGoal)} / ${summary.dailyGoal}`}
          </h3>
          <p>목표 달성 {summary.streak}일 연속</p>
        </div>
      </section>
      <section className={styles.panel}>
        <h2>랭킹 참여 설정</h2>
        <p>
          기본은 비공개예요. 참여하면 이번 주 XP와 공개 닉네임이 보여요.
          실명이나 이메일을 닉네임으로 쓰지 마세요.
        </p>
        <form
          className={styles.stack}
          onSubmit={(event) => void save(event)}>
          <label className={styles.field}>
            공개 닉네임
            <Input
              value={nickname}
              required
              minLength={2}
              maxLength={20}
              disabled={busy}
              placeholder='공개할 별명 2~20자'
              onChange={(event) => setNickname(event.target.value)}
            />
          </label>
          <p className={styles.meta}>
            한글·영문 등 문자, 숫자, 공백과 _ . -를 사용할 수 있어요.
          </p>
          <label className={styles.row}>
            <Checkbox
              checked={participating}
              disabled={busy}
              onChange={(event) => setParticipating(event.target.checked)}
            />
            주간 랭킹에 내 닉네임과 XP 공개
          </label>
          <Button disabled={busy}>참여 설정 저장</Button>
        </form>
        {message && <p role='status'>{message}</p>}
        {error && (
          <p
            className={styles.error}
            role='alert'>
            {error}
          </p>
        )}
      </section>
      <section className={styles.panel}>
        <h2>이번 주 학습 랭킹</h2>
        <p>
          {leaderboard.weekStart} 시작 · 매주 월요일 00:00 초기화 (한국 시간)
        </p>
        <p className={styles.meta}>
          상위 20명과 내 주변 순위예요. 같은 XP는 공동 순위이며, XP는 실력
          평가가 아닌 학습 참여 기록이에요.
        </p>
        {!summary.participating && (
          <p className={styles.notice}>
            지금은 랭킹 비참여 상태예요. 개인 XP와 레벨은 계속 쌓여요.
          </p>
        )}
        {!leaderboard.items.length ? (
          <EmptyState
            title='이번 주 첫 걸음을 기다리고 있어요'
            description='랭킹에 참여하고 학습 XP를 쌓으면 여기에 표시돼요.'
            icon='users'
          />
        ) : (
          <div className={rankingStyles.tableScroll}>
            <table className={rankingStyles.table}>
              <caption>주간 XP 순위</caption>
              <thead>
                <tr>
                  <th scope='col'>순위</th>
                  <th scope='col'>닉네임</th>
                  <th scope='col'>주간 XP</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.items.map((item) => (
                  <tr
                    key={item.position}
                    className={item.isMe ? rankingStyles.me : undefined}>
                    <td>{item.rank}위</td>
                    <th scope='row'>
                      {item.nickname}
                      {item.isMe ? ' (나)' : ''}
                    </th>
                    <td>{item.xp} XP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <section className={styles.panel}>
        <h2>어떻게 XP를 모으나요?</h2>
        <ul>
          <li>구절 받아쓰기·적용 문제 최초 정답: 10 XP, 도움 사용 시 5 XP</li>
          <li>전날까지 저장한 표현 자가점검: 같은 표현·원문 하루 1회, 5 XP</li>
          <li>하루 학습 3개 달성: 보너스 20 XP</li>
          <li>하루 기본 학습 XP 한도: 100 XP, 목표 보너스 별도</li>
          <li>
            누적 100 XP마다 레벨 상승. 정답 재제출·AI 생성·자료 열기는 추가
            보상이 없어요.
          </li>
        </ul>
        <p className={styles.meta}>
          캐릭터: 한국외국어대학교 부(Boo).{' '}
          <a
            href='https://www.hufs.ac.kr/hufs/11137/subview.do'
            target='_blank'
            rel='noreferrer'>
            공식 캐릭터 안내
          </a>
        </p>
      </section>
    </div>
  );
}
