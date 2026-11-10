import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 체크박스의 기본 조작을 유지하며 디자인 색을 적용한다. */
export const root = style({
  appearance: 'none',
  position: 'relative',
  flex: 'none',
  width: 18,
  height: 18,
  border: `1px solid ${vars.color.inputBorder}`,
  borderRadius: 4,
  background: vars.color.surface,
  minHeight: 0,
  padding: 0,
  margin: 0,
  accentColor: vars.color.accent,
  cursor: 'pointer',
  selectors: {
    '&:hover:not(:disabled)': { borderColor: vars.color.accent },
    '&:checked': {
      background: vars.color.accent,
      borderColor: vars.color.accent,
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 1,
      background: vars.color.surface,
      maskImage: 'url(/icons/check.svg)',
      maskSize: 'contain',
      maskPosition: 'center',
      maskRepeat: 'no-repeat',
      opacity: 0,
    },
    '&:checked::before': { opacity: 1 },
    '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
  },
});
