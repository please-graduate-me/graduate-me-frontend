import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 단일 정답 선택도 다른 입력창의 패딩에 영향받지 않게 고정한다. */
export const root = style({
  appearance: 'none',
  position: 'relative',
  flex: 'none',
  width: 18,
  height: 18,
  minHeight: 0,
  padding: 0,
  margin: 0,
  border: `1px solid ${vars.color.inputBorder}`,
  borderRadius: '50%',
  background: vars.color.surface,
  cursor: 'pointer',
  selectors: {
    '&:hover:not(:disabled)': { borderColor: vars.color.accent },
    '&:checked': { borderColor: vars.color.accent },
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 4,
      borderRadius: '50%',
      background: vars.color.accent,
      opacity: 0,
    },
    '&:checked::before': { opacity: 1 },
    '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
  },
});
