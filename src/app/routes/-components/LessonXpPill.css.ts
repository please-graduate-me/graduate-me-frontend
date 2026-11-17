import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 시안의 테두리 알약에 숫자 서체로 누적 XP를 표시한다. */
export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  flex: 'none',
  height: 36,
  paddingInline: vars.space.compact,
  border: `1px solid ${vars.color.line}`,
  borderRadius: vars.radius.pill,
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
  fontVariantNumeric: 'tabular-nums',
});

/** 번개 아이콘은 브랜드 청록으로 XP임을 알린다. */
export const icon = style({ color: vars.color.accent });
