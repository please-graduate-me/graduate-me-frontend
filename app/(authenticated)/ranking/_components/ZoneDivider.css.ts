import { createVar, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const lineColor = createVar();

/** 양쪽 선 사이에 구간 이름을 둔다. */
export const root = style({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '8px 14px',
});

/** 승급은 청록, 강등은 주황 계열로 구분한다. */
export const tone = styleVariants({
  promotion: {
    color: vars.color.accent,
    vars: { [lineColor]: vars.color.accentLine },
  },
  demotion: {
    color: vars.color.warning,
    vars: { [lineColor]: vars.color.quoteLine },
  },
});

/** 남은 폭을 나눠 갖는 2px 선이다. */
export const line = style({
  flex: '1 1 auto',
  height: 2,
  borderRadius: 2,
  background: lineColor,
});

/** 화살표와 구간 이름이다. */
export const label = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xxs,
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.heavy,
});
