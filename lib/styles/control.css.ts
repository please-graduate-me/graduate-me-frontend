import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 여러 입력 컨트롤의 기본·오류·비활성 표현을 한곳에서 관리한다. */
export const root = style({
  minWidth: 0,
  minHeight: 44,
  border: `1px solid ${vars.color.inputBorder}`,
  borderRadius: vars.radius.control,
  padding: '10px 12px',
  fontSize: vars.fontSize.small,
  lineHeight: vars.lineHeight.small,
  background: vars.color.surface,
  color: vars.color.ink,
  transition: 'border-color 120ms',
  selectors: {
    '&:hover:not(:disabled)': { borderColor: vars.color.accent },
    '&:disabled': {
      background: vars.color.canvas,
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    '&[aria-invalid="true"]': { borderColor: vars.color.error },
    '&::placeholder': { color: vars.color.muted, opacity: 1 },
  },
});
