import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 도구 모음에서 아이콘의 클릭 영역과 선택 상태를 유지한다. */
export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  width: 32,
  height: 32,
  padding: 0,
  border: '1px solid transparent',
  borderRadius: vars.radius.control,
  color: vars.color.muted,
  background: 'transparent',
  cursor: 'pointer',
  selectors: {
    '&::after': {
      content: 'attr(data-tooltip)',
      position: 'absolute',
      bottom: 'calc(100% + 8px)',
      left: '50%',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
      opacity: 0,
      padding: '6px 10px',
      borderRadius: vars.radius.control,
      color: vars.color.surface,
      background: vars.color.ink,
      fontSize: vars.fontSize.caption,
      lineHeight: vars.lineHeight.caption,
      whiteSpace: 'nowrap',
      zIndex: 20,
    },
    '&:hover:not(:disabled)::after': { opacity: 1 },
    '&:focus-visible::after': { opacity: 1 },
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

/** 도구 밀도와 큰 클릭 영역을 Figma의 두 크기로 구분한다. */
export const sizes = styleVariants({
  small: { width: 32, height: 32 },
  medium: { width: 44, height: 44 },
});
