import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 공용 부품의 기본 모양과 상태가 사용처마다 달라지지 않게 한다. */
export const root = style({
  background: vars.color.surface,
  padding: vars.space.lg,
  border: `1px solid ${vars.color.line}`,
  borderRadius: vars.radius.panel,
  selectors: { '&[hidden]': { display: 'none' } },
  '@media': { '(max-width: 800px)': { padding: '18px' } },
});
