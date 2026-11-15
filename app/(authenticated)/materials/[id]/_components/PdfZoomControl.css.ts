import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 축소, 배율, 확대를 시안처럼 테두리 있는 알약 하나로 묶는다. */
export const root = style({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  padding: 2,
  border: `1px solid ${vars.color.line}`,
  borderRadius: vars.radius.pill,
});

/** 배율 숫자는 숫자 서체로 폭을 맞춰 자릿수가 바뀌어도 흔들리지 않게 한다. */
export const value = style({
  minWidth: 72,
  paddingInline: vars.space.sm,
  fontFamily: vars.font.numeric,
  fontVariantNumeric: 'tabular-nums',
});
