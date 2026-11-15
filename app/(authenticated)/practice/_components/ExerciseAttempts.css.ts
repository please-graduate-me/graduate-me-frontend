import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 조회 버튼과 제출 기록 카드를 쌓는다. */
export const stack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  paddingTop: 8,
});

/** 조회 버튼은 내용 폭만 차지한다. */
export const load = style({ alignSelf: 'flex-start' });

/** 제출 한 번의 기록 카드다. */
export const attempt = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: vars.space.md,
  borderRadius: 14,
});

/** 판정 표지와 제출 시각을 한 줄에 둔다. */
export const row = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
});

/** 제출 시각과 도움 사용 기록이다. */
export const meta = style({
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.bold,
});

/** 답안과 설명 본문이다. */
export const prose = style({
  fontSize: vars.fontSize.small,
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
});

/** 당시 원문 인용은 기록 카드 안에서 한 단계 작게 둔다. */
export const quote = style({ fontSize: vars.fontSize.small });
