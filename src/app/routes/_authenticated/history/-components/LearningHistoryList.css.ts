import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const reducedMotion = '(prefers-reduced-motion: reduce)';

const rise = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'none' },
});

/** 기록 목록을 넓게, 읽는 법 안내를 옆 좁은 열에 두고 좁은 화면에서는 아래로 내린다. */
export const layout = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: vars.space.xl,
});

/** 제목, 필터, 날짜별 목록을 세로로 쌓는다. */
export const main = style({
  flex: '999 1 600px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.comfortable,
});

/** 제목과 저장 활동 표지를 아래 기준선으로 맞춘다. */
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

/** 언어 선택과 활동 수를 같은 줄에 둔다. */
export const filters = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  gap: vars.space.compact,
});

/** 언어 선택 폭을 짧은 선택지에 맞춘다. */
export const language = style({ flex: '0 1 200px', minWidth: 0 });

/** 활동 수는 선택 상자 글자 기준선에 맞춘다. */
export const count = style({
  marginBottom: vars.space.compact,
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
});

/** 활동 종류 칩을 여러 줄로 감싼다. */
export const kinds = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xs,
});

/** 날짜 묶음 사이 간격이다. */
export const days = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
});

/** 날짜 묶음이 나타날 때 아래에서 살짝 떠오른다. */
export const day = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  animation: `${rise} ${vars.motion.slow} ${vars.motion.easeOut} both`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});

/** 날짜 이름 뒤로 가는 선을 그어 묶음 경계를 보여 준다. */
export const dayHeading = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  marginBottom: vars.space.xxs,
  color: '#33363F',
  fontSize: vars.fontSize.small,
  '::after': {
    content: '""',
    order: 1,
    flex: '1 1 auto',
    height: 1,
    background: vars.color.line,
  },
});

/** 날짜별 활동 수는 구분선 끝에 둔다. */
export const dayCount = style({
  order: 2,
  color: vars.color.muted,
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.bold,
});

/** 한 날짜의 활동 행을 촘촘히 쌓는다. */
export const rows = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

/** 종류, 내용, 시각, 이동을 한 줄에 두고 좁으면 감싼다. */
export const row = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: `${vars.space.sm} ${vars.space.md}`,
  padding: '14px 16px',
  borderRadius: 16,
  transition: `background-color ${vars.motion.fast} ${vars.motion.easeOut}`,
  selectors: { '&:hover': { background: vars.color.canvas } },
  '@media': { [reducedMotion]: { transition: 'none' } },
});

/** 종류 표지 폭을 고정해 행마다 내용 시작점을 맞춘다. */
export const kind = style({
  flex: '0 0 132px',
  boxSizing: 'border-box',
  padding: '6px 10px',
});

/** 활동 제목과 상세가 남은 폭을 채운다. */
export const content = style({ flex: '1 1 260px', minWidth: 0 });

/** 활동 제목이다. */
export const title = style({
  display: 'block',
  fontSize: 15,
  fontWeight: vars.fontWeight.heavy,
  lineHeight: 1.45,
  overflowWrap: 'anywhere',
});

/** 활동 상세다. */
export const detail = style({
  marginTop: 2,
  fontSize: vars.fontSize.label,
  lineHeight: 1.5,
});

/** 시각은 숫자 글꼴로 맞춘다. */
export const time = style({
  flex: '0 0 auto',
  color: vars.color.muted,
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
});

/** 이어서 보기 링크의 누를 수 있는 높이를 확보한다. */
export const link = style({
  flex: '0 0 auto',
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 44,
  padding: '0 12px',
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.heavy,
});

/** 읽는 법 안내 열이다. */
export const aside = style({
  flex: '1 1 260px',
  maxWidth: 320,
  '@media': { '(max-width: 960px)': { maxWidth: 'none' } },
});

/** 안내 카드 안 요소를 세로로 쌓는다. */
export const guide = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.compact,
});

/** 안내 카드의 정보 아이콘 상자다. */
export const guideIcon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: vars.radius.control,
  background: vars.color.neutral,
  color: '#33363F',
});

/** 안내 제목은 본문 제목보다 낮은 위계로 둔다. */
export const guideTitle = style({ fontSize: 15 });

/** 안내 본문이다. */
export const guideText = style({
  color: '#33363F',
  fontSize: vars.fontSize.label,
  lineHeight: 1.7,
});

/** 목록 끝에서 오래된 활동이 잘렸음을 가운데 정렬 문구로 알린다. */
export const truncated = style({
  margin: 0,
  textAlign: 'center',
  fontSize: vars.fontSize.label,
});
