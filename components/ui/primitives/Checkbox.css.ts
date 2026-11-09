import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 체크박스의 기본 조작을 유지하며 디자인 색을 적용한다. */
export const root = style({
  width: 16,
  height: 16,
  minHeight: 0,
  padding: 0,
  margin: 0,
  accentColor: vars.color.accent,
  cursor: 'pointer',
  selectors: { '&:disabled': { opacity: 0.5, cursor: 'not-allowed' } },
});
