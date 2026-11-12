import { z } from 'zod';

/** 서버가 확정한 지급 결과만 학습 보상으로 표시한다. */
export const rewardReceiptSchema = z.object({
  id: z.uuid(),
  xp: z.number().int().positive(),
  dailyBonus: z.number().int().nonnegative(),
  totalXp: z.number().int().nonnegative(),
  previousLevel: z.number().int().positive(),
  level: z.number().int().positive(),
  levelXp: z.number().int().nonnegative(),
  levelTarget: z.number().int().positive(),
  dailyCompleted: z.number().int().nonnegative(),
  dailyGoal: z.number().int().positive(),
});

/** 초기 계정과 비공개 계정도 개인 성장 현황을 조회한다. */
export const growthSummarySchema = z.object({
  totalXp: z.number().int().nonnegative(),
  weeklyXp: z.number().int().nonnegative(),
  todayXp: z.number().int().nonnegative(),
  level: z.number().int().positive(),
  levelXp: z.number().int().nonnegative(),
  levelTarget: z.number().int().positive(),
  dailyCompleted: z.number().int().nonnegative(),
  dailyGoal: z.number().int().positive(),
  dailyGoalReached: z.boolean(),
  dailyLimit: z.number().int().positive(),
  streak: z.number().int().nonnegative(),
  day: z.string(),
  weekStart: z.string(),
  nickname: z.string(),
  participating: z.boolean(),
});

/** 공개 순위 응답에 계정 실명과 이메일을 요구하지 않는다. */
export const leaderboardSchema = z.object({
  weekStart: z.string(),
  items: z.array(
    z.object({
      nickname: z.string(),
      xp: z.number().int().positive(),
      rank: z.number().int().positive(),
      position: z.number().int().positive(),
      isMe: z.boolean(),
    })
  ),
});

/** 지급 영수증을 화면 이벤트와 피드백이 함께 사용한다. */
export type RewardReceipt = z.infer<typeof rewardReceiptSchema>;

/** 성장 현황의 표시 계약을 API 검증과 일치시킨다. */
export type GrowthSummary = z.infer<typeof growthSummarySchema>;

/** 랭킹은 공개 닉네임과 점수만 전달한다. */
export type Leaderboard = z.infer<typeof leaderboardSchema>;
