import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 체크박스의 의미를 유지하며 즉시 적용되는 켜짐과 꺼짐을 표현한다. */
export const root = style({
  appearance: 'none',
  flex: 'none',
  position: 'relative',
  width: 40,
  height: 24,
  minHeight: 0,
  padding: 0,
  margin: 0,
  borderRadius: 20,
  background: vars.color.inputBorder,
  border: `1px solid ${vars.color.inputBorder}`,
  cursor: 'pointer',
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      width: 16,
      height: 16,
      top: 3,
      left: 3,
      borderRadius: '50%',
      background: vars.color.surface,
      transition: 'left 120ms',
    },
    '&:checked': {
      background: vars.color.accent,
      borderColor: vars.color.accent,
    },
    '&:checked::before': { left: 19 },
    '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
  },
});
