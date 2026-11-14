import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 연속 학습, 레벨, 주간 XP 카드를 홈 왼쪽 열에 세로로 쌓는다. */
export const stack = style({ display: 'grid', gap: vars.space.md });

/** 카드 안 요소 간격만 정하고 외형은 Astryx Card에 맡긴다. */
export const card = style({
  display: 'grid',
  gap: vars.space.compact,
  transition: 'transform 180ms ease, box-shadow 180ms ease',
  selectors: {
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(22, 24, 29, 0.08)',
    },
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

/** 시안의 큰 숫자 위계를 Astryx 글자 크기 단계 밖에서 유지한다. */
export const bigNumber = style({
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

/** 레벨과 현재 XP를 한 줄 양 끝에 둔다. */
export const row = style({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: vars.space.sm,
});

/** 개인 성장에서 선택 공개 랭킹으로 이동할 수 있게 한다. */
export const link = style({ color: vars.color.accent, fontWeight: 700 });
