import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 복습 상태 줄과 마지막 점검 안내를 회색 면 안에 묶는다. */
export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  padding: '12px 14px',
  borderRadius: 14,
  background: vars.color.canvas,
});

/** 상태 배지, 단계 글자와 단계 점을 한 줄에 둔다. */
export const row = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.sm,
});

/** 단계 숫자는 숫자 글꼴로 맞춘다. */
export const step = style({
  color: '#33363F',
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
  fontVariantNumeric: 'tabular-nums',
});

/** 다섯 단계를 작은 점으로 나열한다. */
export const pips = style({ display: 'inline-flex', gap: 4 });

/** 지난 단계는 청록, 남은 단계는 옅은 회색 점이다. */
export const pip = style({
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: vars.color.lineStrong,
  selectors: { '&[data-filled="true"]': { background: vars.color.accent } },
});

/** 마지막 자가점검 결과는 낮은 위계의 작은 글자로 둔다. */
export const last = style({
  margin: 0,
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.bold,
});
