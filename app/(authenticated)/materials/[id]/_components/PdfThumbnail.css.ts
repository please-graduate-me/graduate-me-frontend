import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 현재 페이지를 미리보기 테두리와 배경으로 함께 구분한다. */
export const root = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.sm,
  border: '1px solid transparent',
  borderRadius: vars.radius.control,
  padding: '8px 4px',
  marginBottom: vars.space.sm,
  background: 'transparent',
  cursor: 'pointer',
  color: vars.color.muted,
  fontSize: 12,
  width: '100%',
  selectors: {
    '&[aria-current="page"]': {
      borderColor: vars.color.accent,
      color: vars.color.accent,
      background: vars.color.selected,
    },
  },
});
