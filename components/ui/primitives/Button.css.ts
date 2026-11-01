import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';
/** 공용 부품의 기본 모양과 상태가 사용처마다 달라지지 않게 한다. */
export const root = style({
  border: `1px solid ${vars.color.accent}`,
  padding: '10px 16px',
  borderRadius: vars.radius.control,
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  selectors: {
    '&:hover:not(:disabled)': { filter: 'brightness(.94)' },
    '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
  },
});
/** 버튼 의미에 따른 색상 조합을 사용처마다 중복하지 않는다. */
export const variants = styleVariants({
  primary: { background: vars.color.accent, color: vars.color.surface },
  secondary: {
    background: vars.color.surface,
    color: vars.color.ink,
    borderColor: vars.color.line,
  },
});
