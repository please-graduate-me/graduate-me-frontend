import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 도구가 텍스트 선택층 위에 있으면서 선택 문장은 가리지 않게 한다. */
export const root = style({
  position: 'absolute',
  zIndex: 4,
  display: 'flex',
  padding: 6,
  gap: 6,
  borderRadius: 9,
  background: vars.color.surface,
  boxShadow: '0 4px 15px rgb(20 31 51 / 13%)',
});

globalStyle(`${root} button`, {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  minWidth: 0,
  flex: 1,
  height: 32,
  padding: '4px 8px',
  border: 0,
  borderRadius: vars.radius.control,
  font: 'inherit',
  fontSize: 12,
  color: vars.color.ink,
  background: 'transparent',
  cursor: 'pointer',
});

globalStyle(`${root} button:hover`, { background: vars.color.selected });

globalStyle(`${root} button:focus-visible`, {
  outline: `2px solid ${vars.color.focus}`,
  outlineOffset: 2,
});
