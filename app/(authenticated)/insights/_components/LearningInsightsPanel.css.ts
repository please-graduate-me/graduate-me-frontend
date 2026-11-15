import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const reducedMotion = '(prefers-reduced-motion: reduce)';

const rise = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'none' },
});

/** 나타나는 카드가 아래에서 살짝 떠오른다. */
export const appear = style({
  animation: `${rise} ${vars.motion.slow} ${vars.motion.easeOut} both`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});

/** 제목, 조건, 요약, 복습과 로드맵을 세로로 쌓는다. */
export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
  minWidth: 0,
});

/** 제목과 관찰 기준 표지를 아래 기준선으로 맞춘다. */
export const header = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: vars.space.md,
});

/** 제목 아래 설명이다. */
export const description = style({
  marginTop: vars.space.xs,
  fontSize: 15,
});

/** 언어와 기간 선택을 회색 띠에 담고 적용 버튼을 오른쪽 끝에 둔다. */
export const filters = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  gap: `${vars.space.md} ${vars.space.lg}`,
  padding: '16px 20px',
  borderRadius: vars.radius.panel,
  background: vars.color.canvas,
});

/** 선택지 이름과 칩 묶음이다. */
export const group = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

/** 선택지 이름이다. */
export const groupLabel = style({
  color: '#33363F',
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.heavy,
});

/** 조건 적용은 띠 오른쪽 끝에 둔다. */
export const apply = style({ marginLeft: 'auto' });

/** 오답 복습을 넓게, 로드맵을 옆 좁은 열에 둔다. */
export const columns = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: vars.space.xl,
});

/** 실제 오답 복습 열이다. */
export const review = style({
  flex: '999 1 560px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
});

/** 복습 영역 제목과 아이콘을 나란히 둔다. */
export const reviewHeading = style({
  display: 'flex',
  alignItems: 'center',
  gap: 14,
});

/** 듣기 복습을 알리는 주황 아이콘 상자다. */
export const reviewIcon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  borderRadius: vars.radius.control,
  background: vars.color.streakBackground,
  color: vars.color.streak,
});

/** 복습 영역 제목이다. */
export const reviewTitle = style({ fontSize: vars.fontSize.lead });

/** 오답 근거 카드 하나다. */
export const evidence = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.compact,
  borderRadius: vars.radius.card,
});

/** 자료 제목과 차이 분류를 양 끝에 둔다. */
export const evidenceTop = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
});

/** 자료 제목이다. */
export const evidenceTitle = style({ overflowWrap: 'anywhere' });

/** 차이 분류는 줄 오른쪽 끝에 둔다. */
export const category = style({ marginLeft: 'auto' });

/** 시도 수, 원문 버전, 제출 시각이다. */
export const evidenceMeta = style({
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
});

/** 당시 답안 줄이다. */
export const answer = style({
  fontSize: vars.fontSize.small,
  lineHeight: 1.6,
  overflowWrap: 'anywhere',
});

/** 당시 답안 이름표는 주의 색으로 둔다. */
export const answerLabel = style({
  color: vars.color.warning,
  fontWeight: vars.fontWeight.heavy,
});

/** 답안 본문은 숫자 글꼴 계열로 원문과 비교하기 쉽게 둔다. */
export const answerText = style({ fontFamily: vars.font.numeric });

/** 원문 복습 링크의 누를 수 있는 높이를 확보한다. */
export const evidenceLink = style({
  alignSelf: 'flex-start',
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  minHeight: 44,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.heavy,
});
