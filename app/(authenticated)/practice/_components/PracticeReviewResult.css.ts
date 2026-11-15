import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 방금 기록한 복습 일정은 진행 막대 아래 작은 회색 글자로 둔다. */
export const root = style({
  margin: 0,
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.bold,
  fontVariantNumeric: 'tabular-nums',
});

/** 표현은 한 줄을 넘지 않게 말줄임한다. */
export const text = style({
  display: 'inline-block',
  maxWidth: '16em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  verticalAlign: 'bottom',
  color: vars.color.ink,
});
