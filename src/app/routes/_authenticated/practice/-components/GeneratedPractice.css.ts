import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 요청 카드, 보기 칩, 문제 목록과 풀이를 세로로 쌓는다. */
export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
  minWidth: 0,
});

/** 탭 제목과 재풀이 안내 표지를 아래 기준선으로 맞춘다. */
export const header = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: vars.space.compact,
});

/** 탭 제목이다. */
export const title = style({ fontSize: 22 });

/** 탭 제목 아래 설명이다. */
export const description = style({ marginTop: vars.space.xs });

/** 새 문제 요청 카드 안 요소를 세로로 쌓는다. */
export const request = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  padding: vars.space.lg,
  borderRadius: vars.radius.tray,
});

/** 요청 카드 제목이다. */
export const requestTitle = style({ fontSize: 17 });

/** 출제 조건 선택을 폭에 맞춰 여러 칸으로 나눈다. */
export const options = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  gap: vars.space.compact,
});

/** 출제 항목 선택 묶음이다. */
export const sources = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  minWidth: 0,
  margin: 0,
  padding: 0,
  border: 0,
});

/** 출제 항목 선택 설명이다. */
export const legend = style({
  marginBottom: 8,
  padding: 0,
  color: vars.color.muted,
  fontSize: vars.fontSize.label,
});

/** 출제 항목 카드를 폭에 맞춰 여러 열로 채운다. */
export const sourceGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: 8,
});

/** 출제 항목 카드 안 표현과 자료 제목을 쌓는다. */
export const sourceCard = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: 52,
  // 왼쪽 여백은 체크 표시 자리를 두는 공통 스타일에 맡긴다.
  paddingBlock: 8,
  paddingRight: 14,
  borderRadius: 14,
});

/** 출제 항목의 표현이다. */
export const sourceText = style({
  fontFamily: vars.font.numeric,
  fontSize: 15,
  fontWeight: vars.fontWeight.bold,
  overflowWrap: 'anywhere',
});

/** 출제 항목의 자료 제목이다. */
export const sourceTitle = style({
  fontSize: vars.fontSize.caption,
  overflowWrap: 'anywhere',
});

/** 요청 동작을 한 줄에 둔다. */
export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
});

/** 저장 문제 보기 칩을 여러 줄로 감싼다. */
export const filters = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
});

/** 문제 목록과 풀이를 나란히 두고 좁은 화면에서는 풀이를 아래로 내린다. */
export const columns = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: vars.space.lg,
});

/** 저장 문제 목록 열이다. */
export const list = style({
  flex: '1 1 300px',
  minWidth: 0,
  gap: vars.space.sm,
});

/** 저장 문제 카드의 안쪽 여백과 모서리를 시안 크기로 맞춘다. */
export const item = style({ padding: '14px 16px', borderRadius: 14 });

/** 문제 문장이다. */
export const itemTitle = style({
  fontSize: 15,
  fontWeight: vars.fontWeight.heavy,
  lineHeight: 1.45,
});

/** 출처와 풀이 상태 줄이며 오답 복습은 주의 색으로 표시한다. */
export const itemMeta = style({
  marginTop: 2,
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.bold,
  selectors: { '&[data-wrong]': { color: vars.color.warning } },
});

/** 선택한 문제 풀이 열이다. */
export const solver = style({ flex: '999 1 520px', minWidth: 0 });
