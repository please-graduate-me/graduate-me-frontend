import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 체험도 개인 학습과 같은 작업 공간으로 보여준다. */
export const root = style({
  marginTop: '24px',
  paddingBlock: '24px',
  borderTop: `1px solid ${vars.color.line}`,
  fontSize: '14px',
});
