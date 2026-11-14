import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 보기 조건 열과 글 목록 열을 나란히 두고 좁은 화면에서는 위아래로 쌓는다. */
export const root = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: vars.space.xl,
  minWidth: 0,
});

/** 보기 조건은 고정 폭 열로 두어 목록 폭 변화에 흔들리지 않게 한다. */
export const aside = style({
  flex: '1 1 220px',
  maxWidth: 260,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
});

/** 글 모아보기 조건을 세로 행으로 나열한다. */
export const views = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xxs,
});

/** 행 전체를 눌러 고를 수 있도록 버튼을 열 너비로 늘리고 왼쪽 정렬한다. */
export const view = style({ width: '100%', justifyContent: 'flex-start' });

/** 언어 선택 제목과 선택지를 한 묶음으로 둔다. */
export const languages = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

/** 언어 선택지는 알약 버튼을 한 줄에 흘려 배치한다. */
export const languageOptions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
});

/** 긴 제목이 보기 조건 열을 밀지 않게 본문이 남은 폭을 차지한다. */
export const main = style({
  flex: '999 1 560px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.comfortable,
});

/** 제목과 글 쓰기 동작을 아래 기준선에 맞춰 한 행에 둔다. */
export const intro = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: vars.space.md,
});

/** 검색 입력과 버튼을 회색 둥근 바탕 하나로 묶는다. */
export const search = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: '8px 8px 8px 16px',
  borderRadius: 16,
  background: vars.color.canvas,
  color: vars.color.muted,
});

/** 검색 입력이 버튼을 제외한 남은 폭을 사용한다. */
export const searchInput = style({ flex: '1 1 auto', minWidth: 0 });

/** 글 카드를 목록 표식 없이 일정한 간격으로 쌓는다. */
export const list = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
});

/** 페이지 이동을 목록 아래 가운데에 둔다. */
export const pagination = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
  fontSize: vars.fontSize.small,
  color: vars.color.muted,
});
