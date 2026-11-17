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

/** 주간 리그 등급은 브론즈·실버·골드 순서로 오른다. */
export const leagueTierSchema = z.enum(['bronze', 'silver', 'gold']);

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
  weekEndsAt: z.string(),
  weekDays: z
    .array(
      z.object({
        day: z.string(),
        studied: z.boolean(),
        goalReached: z.boolean(),
        today: z.boolean(),
      })
    )
    .length(7),
  weeklyCompletedItems: z.number().int().nonnegative(),
  weeklySavedExpressions: z.number().int().nonnegative(),
  rewards: z.object({
    video: z.number().int().positive(),
    exercise: z.number().int().positive(),
    assisted: z.number().int().positive(),
    review: z.number().int().positive(),
    dailyBonus: z.number().int().positive(),
  }),
  tier: leagueTierSchema,
  nickname: z.string(),
  participating: z.boolean(),
});

/** 같은 주·등급 그룹 안의 순위와 승급·강등 구간 표시다. */
export const leagueSchema = z.object({
  tier: leagueTierSchema,
  joined: z.boolean(),
  groupId: z.string().nullable(),
  size: z.number().int().nonnegative(),
  groupLimit: z.number().int().positive(),
  promotionSlots: z.number().int().nonnegative(),
  demotionSlots: z.number().int().nonnegative(),
  myPosition: z.number().int().positive().nullable(),
  myRank: z.number().int().positive().nullable(),
  myXp: z.number().int().nonnegative(),
  xpToPromotion: z.number().int().nonnegative().nullable(),
  members: z.array(
    z.object({
      nickname: z.string(),
      xp: z.number().int().nonnegative(),
      rank: z.number().int().positive(),
      position: z.number().int().positive(),
      isMe: z.boolean(),
      zone: z.enum(['promotion', 'demotion', 'stay']),
    })
  ),
  lastResult: z
    .object({
      weekStart: z.string(),
      tier: leagueTierSchema,
      position: z.number().int().positive(),
      result: z.enum(['promoted', 'demoted', 'stayed']),
    })
    .nullable(),
});

/** 공개 순위 응답에 계정 실명과 이메일을 요구하지 않는다. */
export const leaderboardSchema = z.object({
  weekStart: z.string(),
  weekEndsAt: z.string(),
  daysLeft: z.number().int().nonnegative(),
  hoursLeft: z.number().int().nonnegative(),
  league: leagueSchema.nullable(),
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

/** 리그 등급 식별자다. */
export type LeagueTier = z.infer<typeof leagueTierSchema>;

/** 참여 중인 계정의 이번 주 리그 현황이다. */
export type League = z.infer<typeof leagueSchema>;

/** 랭킹은 공개 닉네임과 점수만 전달한다. */
export type Leaderboard = z.infer<typeof leaderboardSchema>;
