import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 도구 모음에서 아이콘의 클릭 영역과 선택 상태를 유지한다. */
export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  padding: 0,
  border: '1px solid transparent',
  borderRadius: vars.radius.control,
  color: vars.color.muted,
  background: 'transparent',
  cursor: 'pointer',
  selectors: {
    '&:hover:not(:disabled)': {
      background: vars.color.selected,
      color: vars.color.accent,
    },
    '&:active:not(:disabled)': { background: vars.color.neutral },
    '&[aria-pressed="true"]': {
      background: vars.color.selected,
      color: vars.color.accent,
    },
    '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
  },
});
