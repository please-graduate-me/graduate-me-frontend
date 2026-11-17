import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 연속 학습, 레벨, 이번 주 순위 카드를 홈 왼쪽 열에 세로로 쌓는다. */
export const stack = style({ display: 'grid', gap: vars.space.md });

/** 카드 안 요소 간격과 가리킬 때 떠오르는 움직임만 정하고 외형은 공통 Card에 맡긴다. */
export const card = style({
  display: 'grid',
  gap: vars.space.compact,
  transition: 'transform 180ms ease, box-shadow 180ms ease',
  selectors: {
    '&:hover': { transform: 'translateY(-2px)', boxShadow: vars.shadow.lift },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
      selectors: { '&:hover': { transform: 'none' } },
    },
  },
});

/** 연속 학습일 숫자를 가장 먼저 읽히게 크게 둔다. */
export const streak = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: vars.space.xs,
});

/** 시안의 40px 숫자 서체 위계를 공통 글자 크기 단계 밖에서 유지한다. */
export const bigNumber = style({
  fontFamily: vars.font.numeric,
  fontSize: 40,
  fontWeight: 700,
  lineHeight: 1,
  fontVariantNumeric: 'tabular-nums',
});

/** 연속 학습 표시는 주황으로 XP의 청록과 구분한다. */
export const flame = style({
  display: 'inline-flex',
  alignSelf: 'center',
  color: vars.color.streak,
});

/** 남은 학습 수를 본문색 굵은 글자로 강조한다. */
export const emphasis = style({
  color: vars.color.ink,
  fontWeight: vars.fontWeight.heavy,
});

/** 레벨과 현재 XP를 한 줄 양 끝에 둔다. */
export const row = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
});

/** 왼쪽 열 카드 제목은 시안의 16px 단계를 쓴다. */
export const cardTitle = style({ fontSize: vars.fontSize.body });

/** XP 수치와 남은 XP 문구는 13px로 낮춘다. */
export const levelXp = style({ fontSize: vars.fontSize.label });
