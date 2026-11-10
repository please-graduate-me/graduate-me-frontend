import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 첫 사용과 검색 결과 없음에서 다음 행동을 제공할 공간을 확보한다. */
export const root = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  textAlign: 'center',
  padding: vars.space.lg,
  gap: vars.space.md,
  color: vars.color.muted,
  minHeight: 270,
});

/** 장식 아이콘을 본문의 주 행동과 구분한다. */
export const icon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 30,
  height: 30,
  color: vars.color.inputBorder,
});

globalStyle(`.${root} h3`, {
  color: vars.color.ink,
  margin: 0,
  fontSize: vars.fontSize.heading3,
});

globalStyle(`.${root} p`, {
  margin: 0,
  maxWidth: 420,
  fontSize: vars.fontSize.small,
});
