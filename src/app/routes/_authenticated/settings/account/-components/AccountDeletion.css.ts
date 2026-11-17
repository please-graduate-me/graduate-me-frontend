import { keyframes, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const appear = keyframes({
  from: { opacity: 0, transform: 'translateY(6px)' },
  to: { opacity: 1, transform: 'none' },
});

const reducedMotion = '(prefers-reduced-motion: reduce)';

// 위험 작업 영역만 쓰는 옅은 장미색이라 공통 토큰 대신 이 화면에 둔다.
const dangerLine = '#F3C6CF';
const dangerSurface = '#FFFBFB';

/** 탈퇴 안내를 읽기 좋은 폭의 한 열로 쌓는다. */
export const page = style({
  maxWidth: 820,
  marginInline: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
  minWidth: 0,
});

/** 설정으로 돌아가는 보조 이동을 제목 위에 둔다. */
export const back = style({
  alignSelf: 'flex-start',
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  minHeight: 44,
  color: vars.color.muted,
  fontSize: vars.fontSize.small,
  marginBottom: -12,
});

/** 삭제 범위와 보존 범위를 넓은 화면에서 나란히 비교하게 한다. */
export const cards = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.md,
});

/** 비교 카드 한 장의 폭과 내부 간격이다. */
export const card = style({
  flex: '1 1 320px',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.compact,
  padding: 22,
});

/** 아이콘 타일과 카드 제목을 한 줄에 둔다. */
export const cardHeading = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
});

/** 카드 제목 크기다. */
export const cardTitle = style({ fontSize: 17 });

/** 카드 제목 앞의 둥근 사각 아이콘 자리다. */
export const iconTile = style({
  width: 40,
  height: 40,
  flex: 'none',
  borderRadius: vars.radius.control,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

/** 삭제는 오류색, 보존은 청록으로 의미를 나눈다. */
export const tileTone = styleVariants({
  removed: { background: vars.color.errorBackground, color: vars.color.error },
  kept: { background: vars.color.selected, color: vars.color.accent },
});

/** 정책 문장을 넉넉한 줄 간격으로 읽게 한다. */
export const prose = style({ fontSize: 15, lineHeight: 1.75 });

/** 삭제 대상을 칩으로 나열한다. */
export const chips = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xs,
});

/** 삭제 대상 한 개의 회색 칩이다. */
export const chip = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: '6px 10px',
  borderRadius: vars.radius.small,
  background: vars.color.canvas,
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
});

const marker = { width: 14, height: 14, flex: 'none' } as const;

/** 자료 종류마다 서비스의 자료 색과 모양으로 작은 표지를 그린다. */
export const shape = styleVariants({
  document: { ...marker, height: 16, borderRadius: 3, background: '#8B7CF6' },
  expression: { ...marker, borderRadius: 3, background: vars.color.info },
  conversation: {
    ...marker,
    borderRadius: '7px 7px 7px 2px',
    background: vars.color.accentBright,
  },
  practice: {
    ...marker,
    borderRadius: '50%',
    background: vars.color.streakBright,
  },
  session: { ...marker, borderRadius: 3, background: vars.color.subtle },
});

/** 질문과 공개 답변의 자리를 말풍선 모양으로 보여 주는 회색 상자다. */
export const thread = style({
  marginTop: 2,
  padding: 14,
  borderRadius: vars.radius.control,
  background: vars.color.canvas,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

/** 다른 사람의 질문 자리다. */
export const question = style({
  alignSelf: 'flex-start',
  width: '62%',
  height: 36,
  borderRadius: '14px 14px 14px 4px',
  border: `1px solid ${vars.color.line}`,
  background: vars.color.surface,
});

/** 보존되는 내 공개 답변 자리다. */
export const answer = style({
  alignSelf: 'flex-end',
  width: '54%',
  height: 36,
  borderRadius: '14px 14px 4px 14px',
  background: vars.color.accent,
});

/** 보존되는 쪽이 공개 답변임을 말풍선 아래에 적는다. */
export const threadCaption = style({
  alignSelf: 'flex-end',
  fontSize: 11,
  fontWeight: vars.fontWeight.heavy,
  color: vars.color.accent,
});

/** 되돌릴 수 없다는 안내를 아이콘과 한 줄에 둔다. */
export const note = style({
  display: 'flex',
  gap: vars.space.compact,
  padding: '16px 18px',
  lineHeight: 1.65,
});

/** 안내 아이콘을 첫 줄 높이에 맞추고 정보 파랑으로 칠한다. */
export const noteIcon = style({ marginTop: 1, color: vars.color.info });

/** 안내 머리말을 본문보다 진하게 둔다. */
export const noteTitle = style({ color: vars.color.ink });

/** 삭제 확인 입력과 실행을 위험 영역으로 묶는다. */
export const confirm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  padding: vars.space.lg,
  border: `1px solid ${dangerLine}`,
  borderRadius: vars.radius.card,
  background: dangerSurface,
  '@media': { '(max-width: 800px)': { padding: vars.space.comfortable } },
});

/** 확인 문구 입력의 폭을 짧은 단어에 맞게 제한한다. */
export const confirmField = style({ maxWidth: 360 });

/** 삭제 실패 안내를 부드럽게 떠올린다. */
export const error = style({
  animation: `${appear} 300ms ${vars.motion.easeOut}`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});
