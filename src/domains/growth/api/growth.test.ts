import { afterEach, describe, expect, it, vi } from 'vitest';
import { actionResultSchema } from '@/domains/videos/model/contracts';
import { exerciseResultSchema } from '@/domains/ai/model/contracts';
import { getGrowth, getLeaderboard, updateGrowthPreferences } from './growth';

const summary = {
  totalXp: 120,
  weeklyXp: 120,
  todayXp: 100,
  level: 2,
  levelXp: 20,
  levelTarget: 100,
  dailyCompleted: 10,
  dailyGoal: 3,
  dailyGoalReached: true,
  dailyLimit: 100,
  streak: 1,
  day: '2026-11-11',
  weekStart: '2026-11-09',
  weekEndsAt: '2026-11-15T15:00:00.000Z',
  weekDays: Array.from({ length: 7 }, (_, i) => ({
    day: `2026-11-${String(9 + i).padStart(2, '0')}`,
    studied: i === 2,
    goalReached: i === 2,
    today: i === 2,
  })),
  weeklyCompletedItems: 10,
  weeklySavedExpressions: 2,
  rewards: { video: 10, exercise: 10, assisted: 5, review: 5, dailyBonus: 20 },
  tier: 'bronze',
  nickname: '',
  participating: false,
};

afterEach(() => vi.unstubAllGlobals());

describe('성장 API의 공개와 지급 계약', () => {
  it('조회는 읽기 요청으로 보내고 서버가 확정한 레벨과 목표만 사용한다', async () => {
    const transport = vi.fn(async () => Response.json(summary));

    expect(await getGrowth(transport)).toEqual(summary);
    expect(transport).toHaveBeenCalledWith('/api/growth', undefined);
  });

  it('리그 현황의 등급·구간·승급까지 필요한 XP를 검증하고 미참여는 null로 받는다', async () => {
    const board = {
      weekStart: '2026-11-09',
      weekEndsAt: '2026-11-15T15:00:00.000Z',
      daysLeft: 5,
      hoursLeft: 110,
      items: [],
      league: {
        tier: 'silver',
        joined: true,
        groupId: 'group',
        size: 2,
        groupLimit: 30,
        promotionSlots: 10,
        demotionSlots: 5,
        myPosition: 2,
        myRank: 2,
        myXp: 40,
        xpToPromotion: 0,
        members: [
          {
            nickname: '부',
            xp: 50,
            rank: 1,
            position: 1,
            isMe: false,
            zone: 'promotion',
          },
          {
            nickname: '나',
            xp: 40,
            rank: 2,
            position: 2,
            isMe: true,
            zone: 'promotion',
          },
        ],
        lastResult: null,
      },
    };

    const transport = vi.fn(async () => Response.json(board));

    expect((await getLeaderboard(transport)).league?.members[1].zone).toBe(
      'promotion'
    );

    const empty = vi.fn(async () => Response.json({ ...board, league: null }));

    expect((await getLeaderboard(empty)).league).toBeNull();

    const broken = vi.fn(async () =>
      Response.json({ ...board, league: { ...board.league, tier: 'diamond' } })
    );

    await expect(getLeaderboard(broken)).rejects.toThrow();
  });

  it('참여 해제는 공개 프로필만 변경하고 클라이언트 XP를 전송하지 않는다', async () => {
    const fetch = vi.fn(async () => Response.json(summary));

    vi.stubGlobal('fetch', fetch);
    await updateGrowthPreferences('성장하는부', false);
    const init = fetch.mock.calls[0] as unknown as [string, RequestInit];

    expect(init[0]).toBe('/api/growth/preferences');
    expect(init[1].method).toBe('PATCH');

    expect(JSON.parse(init[1].body as string)).toEqual({
      nickname: '성장하는부',
      participating: false,
    });
  });

  it('기존 보상 없는 응답을 유지하고 잘못된 지급량을 거부한다', () => {
    expect(actionResultSchema.parse({ nextIndex: 1 })).toEqual({
      nextIndex: 1,
    });

    expect(actionResultSchema.safeParse({ reward: { xp: -10 } }).success).toBe(
      false
    );

    expect(exerciseResultSchema.shape.reward.safeParse(null).success).toBe(
      true
    );
  });
});
