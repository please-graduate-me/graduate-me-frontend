import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 선택한 방식의 밑줄과 입력 영역을 같은 기준선에 맞춘다. */
export const root = style({
  display: 'flex',
  gap: '24px',
  borderBottom: `1px solid ${vars.color.line}`,
  marginBottom: '18px',
});

/** 탭 모양의 전환 버튼도 키보드의 기본 버튼 조작을 유지한다. */
export const option = style({
  padding: '12px 0',
  minHeight: '44px',
  border: 0,
  borderBottom: '2px solid transparent',
  background: 'transparent',
  color: vars.color.muted,
  fontSize: '13px',
  cursor: 'pointer',
  selectors: {
    '&[aria-pressed="true"]': {
      borderBottomColor: vars.color.accent,
      color: vars.color.ink,
      fontWeight: 700,
    },
    '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
  },
});
