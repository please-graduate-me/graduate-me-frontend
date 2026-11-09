import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 첫 사용과 검색 결과 없음에서 다음 행동을 제공할 공간을 확보한다. */
export const root = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  textAlign: 'center',
  padding: '48px 24px',
  color: vars.color.muted,
  minHeight: 200,
});

/** 장식 아이콘을 본문의 주 행동과 구분한다. */
export const icon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: vars.radius.panel,
  background: vars.color.selected,
  color: vars.color.accent,
  marginBottom: vars.space.md,
});

globalStyle(`.${root} h3`, {
  color: vars.color.ink,
  margin: '0 0 8px',
  fontSize: vars.fontSize.heading3,
});

globalStyle(`.${root} p`, {
  margin: '0 0 20px',
  maxWidth: 420,
  fontSize: vars.fontSize.small,
});
