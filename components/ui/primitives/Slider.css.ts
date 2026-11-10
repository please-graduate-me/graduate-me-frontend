import { createVar, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 재생값을 CSS 트랙에 반영하되 실제 입력은 네이티브 range로 유지한다. */
export const progress = createVar();

/** 트랙·손잡이·끌기·비활성 상태를 Figma의 같은 치수로 표시한다. */
export const root = style({
  appearance: 'none',
  width: 260,
  height: 24,
  minHeight: 0,
  padding: 0,
  margin: 0,
  border: 0,
  borderRadius: vars.radius.control,
  background: 'transparent',
  cursor: 'pointer',
  selectors: {
    '&::-webkit-slider-runnable-track': {
      height: 4,
      borderRadius: 999,
      background: `linear-gradient(to right, ${vars.color.accent} 0%, ${vars.color.accent} ${progress}, ${vars.color.line} ${progress}, ${vars.color.line} 100%)`,
    },
    '&::-webkit-slider-thumb': {
      appearance: 'none',
      width: 12,
      height: 12,
      marginTop: -4,
      border: `2px solid ${vars.color.accent}`,
      borderRadius: '50%',
      background: vars.color.surface,
    },
    '&:active::-webkit-slider-thumb': { width: 16, height: 16, marginTop: -6 },
    '&::-moz-range-track': {
      height: 4,
      borderRadius: 999,
      background: vars.color.line,
    },
    '&::-moz-range-progress': {
      height: 4,
      borderRadius: 999,
      background: vars.color.accent,
    },
    '&::-moz-range-thumb': {
      width: 8,
      height: 8,
      border: `2px solid ${vars.color.accent}`,
      borderRadius: '50%',
      background: vars.color.surface,
    },
    '&:active::-moz-range-thumb': { width: 12, height: 12 },
    '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
  },
});
