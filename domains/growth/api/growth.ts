import { jsonBody, request, type Transport } from '@/lib/api/request';
import { growthSummarySchema, leaderboardSchema } from '../model/contracts';

/** XP 조회가 새 보상을 생성하지 않게 조회 API를 사용한다. */
export const getGrowth = (transport?: Transport) =>
  request('/api/growth', growthSummarySchema, undefined, transport);

/** 공개 참여자의 주간 점수와 내 주변 순위를 가져온다. */
export const getLeaderboard = (transport?: Transport) =>
  request('/api/growth/leaderboard', leaderboardSchema, undefined, transport);

/** 랭킹 공개 여부를 개인 학습 기록과 분리해 저장한다. */
export const updateGrowthPreferences = (
  nickname: string,
  participating: boolean
) =>
  request('/api/growth/preferences', growthSummarySchema, {
    ...jsonBody({ nickname, participating }),
    method: 'PATCH',
  });
