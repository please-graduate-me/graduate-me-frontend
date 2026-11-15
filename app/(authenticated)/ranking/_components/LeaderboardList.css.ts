import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 순위 행을 하나의 테두리 안에 모아 표처럼 한눈에 비교하게 한다. */
export const list = style({
  listStyle: 'none',
  margin: 0,
  padding: vars.space.compact,
  border: `1px solid ${vars.color.line}`,
  borderRadius: 22,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  minWidth: 0,
});

/** 순위, 이니셜, 닉네임, XP를 한 줄에 두고 마우스를 올린 행을 옅게 칠한다. */
export const row = style({
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '10px 14px',
  borderRadius: 14,
  transition: 'background-color 150ms ease',
  selectors: { '&:hover': { background: vars.color.canvas } },
  '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
});

/** 내 기록은 청록 바탕으로 식별하고 보조 기술에는 숨김 문구로 알린다. */
export const me = style({
  background: vars.color.selected,
  selectors: { '&:hover': { background: vars.color.selectedHover } },
});

/** 자릿수가 달라도 순위 열 너비가 흔들리지 않게 한다. */
export const rank = style({
  flex: '0 0 28px',
  textAlign: 'center',
  fontFamily: vars.font.numeric,
  fontSize: 15,
  fontWeight: 700,
  color: vars.color.muted,
  fontVariantNumeric: 'tabular-nums',
  selectors: { [`${me} &`]: { color: vars.color.accent } },
});

/** 긴 닉네임은 남는 너비 안에서 줄을 바꿔 이니셜 원과 XP 열을 밀어내지 않게 한다. */
export const name = style({
  flex: '1 1 0',
  minWidth: 0,
  fontSize: 15,
  fontWeight: 700,
  overflowWrap: 'anywhere',
});

/** XP 수치는 오른쪽 끝에서 자릿수를 맞춰 비교하게 한다. */
export const xp = style({
  flexShrink: 0,
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.small,
  fontWeight: 700,
  color: vars.color.muted,
  fontVariantNumeric: 'tabular-nums',
  selectors: { [`${me} &`]: { color: vars.color.accent } },
});

/** 상위 순위와 내 주변 순위 사이가 끊겼음을 알린다. */
export const gap = style({
  display: 'flex',
  justifyContent: 'center',
  paddingBlock: vars.space.xxs,
  color: vars.color.muted,
});
