import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 순위 목록과 내 기록 열을 넓은 화면에서 나란히, 좁은 화면에서 위아래로 둔다. */
export const root = style({
  maxWidth: 1120,
  marginInline: 'auto',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: vars.space.xl,
  minWidth: 0,
});

/** 순위 목록 열이 남는 너비를 먼저 차지하게 한다. */
export const main = style({
  flex: '999 1 560px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
});

/** 내 기록 열은 넓은 화면에서 좁게 고정하고 한 열로 접히면 전체 너비를 쓴다. */
export const aside = style({
  flex: '1 1 280px',
  maxWidth: 340,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  '@media': { '(max-width: 959px)': { maxWidth: 'none' } },
});

/** 캐릭터와 제목을 가운데 모아 화면의 시작점을 만든다. */
export const hero = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: vars.space.compact,
  paddingBlock: '8px 4px',
});

/** 순위 제목과 새로 조회 버튼을 한 줄 양 끝에 둔다. */
export const boardHeader = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: vars.space.compact,
});

/** 제목 아래 초기화 규칙 문장을 붙여 읽게 한다. */
export const boardTitle = style({
  display: 'grid',
  gap: vars.space.xxs,
  minWidth: 0,
});

/** 순위 목록 위아래 안내 요소 사이 간격을 맞춘다. */
export const board = style({
  display: 'grid',
  gap: vars.space.md,
  minWidth: 0,
});

/** 카드 안 요소 간격만 정하고 외형은 공통 Card에 맡긴다. */
export const panel = style({
  display: 'grid',
  gap: vars.space.md,
  minWidth: 0,
});
