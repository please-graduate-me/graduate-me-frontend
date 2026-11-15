import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 요일 7칸을 같은 폭으로 나눈다. */
export const list = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
  gap: vars.space.xxs,
  margin: 0,
  padding: 0,
  listStyle: 'none',
  textAlign: 'center',
});

/** 점과 요일 이름을 세로로 둔다. */
export const day = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 6,
});

/** 시안의 30px 원 칸이다. */
export const dot = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 30,
  height: 30,
  boxSizing: 'border-box',
  borderRadius: '50%',
});

/** 목표 달성은 주황 채움, 오늘은 주황 고리, 학습만 한 날은 옅은 주황, 나머지는 회색이다. */
export const dotState = styleVariants({
  done: { background: vars.color.streakBright, color: vars.color.onAccent },
  today: { border: `2px solid ${vars.color.streakBright}` },
  studied: { background: vars.color.streakBackground },
  idle: { background: vars.color.neutral },
});

/** 요일 이름은 12px 굵은 글자다. */
export const label = style({
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.subtle,
});

/** 오늘 요일은 본문색으로 더 굵게 둔다. */
export const today = style({
  color: vars.color.ink,
  fontWeight: vars.fontWeight.heavy,
});
