import { keyframes, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 공용 부품의 기본 모양과 상태가 사용처마다 달라지지 않게 한다. */
export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.xs,
  border: `1px solid ${vars.color.accent}`,
  padding: '10px 16px',
  borderRadius: vars.radius.control,
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  fontSize: vars.fontSize.small,
  lineHeight: '20px',
  transition: 'background-color 120ms, border-color 120ms, color 120ms',
  selectors: {
    '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
  },
});

/** 버튼 의미에 따른 색상 조합을 사용처마다 중복하지 않는다. */
export const variants = styleVariants({
  primary: {
    background: vars.color.accent,
    color: vars.color.surface,
    selectors: {
      '&:hover:not(:disabled)': { background: vars.color.accentHover },
      '&:active:not(:disabled)': { background: vars.color.accentPressed },
    },
  },
  secondary: {
    background: vars.color.surface,
    color: vars.color.ink,
    borderColor: vars.color.line,
    selectors: {
      '&:hover:not(:disabled)': {
        background: vars.color.canvas,
        borderColor: vars.color.inputBorder,
      },
      '&:active:not(:disabled)': { background: vars.color.selected },
    },
  },
  ghost: {
    background: 'transparent',
    borderColor: 'transparent',
    color: vars.color.muted,
    selectors: {
      '&:hover:not(:disabled)': {
        background: vars.color.selected,
        color: vars.color.accent,
      },
    },
  },
  danger: {
    background: vars.color.errorBackground,
    borderColor: vars.color.errorBackground,
    color: vars.color.error,
  },
});

/** 보통 행동과 밀도가 높은 도구 모음의 크기를 구분한다. */
export const sizes = styleVariants({
  medium: { minHeight: 44, padding: '10px 16px' },
  small: {
    minHeight: 34,
    padding: '6px 12px',
    fontSize: vars.fontSize.caption,
  },
});

/** 처리 중 상태에서도 버튼의 크기와 문구를 유지한다. */
export const spinner = style({
  animation: `${keyframes({ to: { transform: 'rotate(360deg)' } })} 900ms linear infinite`,
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
});
