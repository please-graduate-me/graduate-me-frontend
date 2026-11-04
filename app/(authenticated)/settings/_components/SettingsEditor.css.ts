import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 저장 중 모든 조작을 하나의 그룹으로 잠근다. */
export const options = style({
  border: 0,
  padding: 0,
  margin: '32px 0 0',
  minWidth: 0,
});

/** 항목 이름과 설정값을 같은 행에서 비교하게 한다. */
export const row = style({
  fontSize: 16,
  fontWeight: 400,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 32,
  padding: '24px 0',
  borderBottom: `1px solid ${vars.color.line}`,
  selectors: { '&:first-child': { borderTop: `1px solid ${vars.color.line}` } },
  '@media': { '(max-width: 800px)': { gap: 16, padding: '20px 0' } },
});

/** 설정 항목의 이름은 선택값과 구별한다. */
export const name = style({ fontSize: 16, fontWeight: 600 });

globalStyle(`.${row} select`, {
  width: 176,
  flex: 'none',
  minHeight: 44,
  border: `1px solid ${vars.color.inputBorder}`,
  borderRadius: vars.radius.control,
  color: vars.color.ink,
  background: vars.color.surface,
  padding: '8px 12px',
  fontWeight: 400,
  '@media': { '(max-width: 800px)': { width: 148 } },
});

globalStyle(`.${row} select:disabled`, {
  color: vars.color.muted,
  background: '#f3f5f9',
  opacity: 0.6,
});

/** 체크박스 의미와 키보드 조작을 유지하며 켜짐을 표현한다. */
export const toggle = style({
  appearance: 'none',
  flex: 'none',
  position: 'relative',
  width: 44,
  height: 26,
  padding: 0,
  borderRadius: 20,
  background: '#c6cfdf',
  border: '1px solid #a5b4d0',
  cursor: 'pointer',
  margin: 0,
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      width: 18,
      height: 18,
      top: 3,
      left: 3,
      borderRadius: '50%',
      background: vars.color.surface,
    },
    '&:checked': {
      background: vars.color.accent,
      borderColor: vars.color.accent,
    },
    '&:checked::before': { left: 21 },
    '&:disabled': { cursor: 'not-allowed', opacity: 0.6 },
  },
});

/** 반복 횟수와 일시정지 의미를 조작 아래에 설명한다. */
export const note = style({
  fontSize: 13,
  color: vars.color.muted,
  margin: '18px 0 0',
  maxWidth: '65ch',
  '@media': { '(max-width: 800px)': { lineHeight: 1.7 } },
});

/** 저장 성공과 대기, 실패를 실제 훅 상태에 맞춰 알린다. */
export const status = style({
  fontSize: 13,
  color: vars.color.muted,
  margin: '20px 0 0',
  selectors: {
    '&::before': {
      content: '""',
      display: 'inline-block',
      width: 6,
      height: 6,
      background: vars.color.match,
      borderRadius: '50%',
      marginRight: 8,
    },
    '&[data-state="saving"]::before': { background: vars.color.muted },
    '&[data-state="error"]': { color: vars.color.error },
    '&[data-state="error"]::before': { background: vars.color.error },
  },
});
