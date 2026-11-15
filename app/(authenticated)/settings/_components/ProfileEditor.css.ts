import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const appear = keyframes({
  from: { opacity: 0, transform: 'translateY(6px)' },
  to: { opacity: 1, transform: 'none' },
});

/** 안내, 입력 묶음, 오류를 읽는 순서대로 쌓는다. */
export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

/** 저장 중 잠금을 한 묶음으로 관리하고 입력 사이 간격을 넓게 둔다. */
export const fields = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 22,
  minWidth: 0,
  margin: 0,
  padding: 0,
  border: 0,
});

/** 목표 언어를 약어로 한눈에 구분하는 먹색 칩이다. */
export const code = style({
  width: 36,
  height: 28,
  flex: 'none',
  borderRadius: vars.radius.small,
  background: vars.color.ink,
  color: vars.color.onAccent,
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

/** 설명 언어와 수준을 넓은 화면에서는 나란히, 좁으면 세로로 둔다. */
export const pair = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.comfortable,
});

/** 나란히 놓인 선택 입력이 수준 선택과 같은 비율로 폭을 나눈다. */
export const pairField = style({ flex: '1 1 220px', minWidth: 0 });

/** 수준 선택의 라벨과 선택지를 세로로 묶고 설명 언어와 폭을 나눈다. */
export const pairItem = style({
  flex: '1 1 220px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

/** 분할 선택 위의 보이는 이름을 입력 라벨과 같은 위계로 둔다. */
export const label = style({
  color: vars.color.ink,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
  lineHeight: vars.lineHeight.small,
});

/** 언어 변경과 자기평가의 의미를 회색 상자로 덧붙인다. */
export const note = style({
  padding: '14px 16px',
  borderRadius: vars.radius.control,
  background: vars.color.canvas,
  color: vars.color.muted,
  fontSize: vars.fontSize.label,
  lineHeight: 1.7,
});

/** 저장 버튼과 저장 완료 표시를 한 줄에 둔다. */
export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.compact,
});

/** 저장 완료를 버튼 옆 청록 알약으로 짧게 떠올린다. */
export const saved = style({
  margin: 0,
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: '10px 14px',
  borderRadius: vars.radius.control,
  background: vars.color.selected,
  color: vars.color.accent,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
  animation: `${appear} 300ms ${vars.motion.easeOut}`,
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
});
