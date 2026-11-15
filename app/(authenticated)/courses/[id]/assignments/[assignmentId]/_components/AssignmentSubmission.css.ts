import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const enter = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'none' },
});

/** 제출 한 건의 상태, 정보와 답안을 세로로 쌓는다. */
export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
});

/** 방금 저장한 제출은 아래에서 떠올라 새로 생겼음을 알린다. */
export const fresh = style({
  animation: `${enter} 400ms ${vars.motion.easeOut}`,
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
});

/** 제출 상태 표지와 제출자·시각 정보를 한 줄에 둔다. */
export const header = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.sm,
});

/** 제출자, 시각과 힌트 사용 횟수는 낮은 위계로 둔다. */
export const meta = style({
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.muted,
});

/** 답안을 목록 표식 없이 쌓는다. */
export const answers = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

/** 답안 하나의 번호, 내용과 결과를 회색 면 한 줄에 두고 좁으면 줄을 바꾼다. */
export const answer = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '8px 12px',
  padding: '12px 14px',
  borderRadius: 14,
  background: vars.color.canvas,
});

/** 답안 번호는 작은 보조색 제목으로 둔다. */
export const number = style({
  margin: 0,
  flex: '0 0 auto',
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.heavy,
  color: vars.color.muted,
});

/** 답안 내용은 숫자 글꼴로 남은 폭을 차지한다. */
export const text = style({
  flex: '1 1 140px',
  minWidth: 0,
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.body,
  fontWeight: vars.fontWeight.bold,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
});

/** 당시 정답은 답안 아래 한 줄 전체를 차지한다. */
export const expected = style({
  flex: '1 1 100%',
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
});

/** 정답 값은 숫자 글꼴로 답안과 맞춘다. */
export const expectedValue = style({ fontFamily: vars.font.numeric });
