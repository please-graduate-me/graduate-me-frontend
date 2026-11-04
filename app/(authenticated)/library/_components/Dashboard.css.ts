import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 목록 탐색을 우선하고 등록과 추천을 오른쪽 보조 영역에 둔다. */
export const workspace = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 320px',
  gridTemplateRows: 'auto 1fr',
  columnGap: 40,
  rowGap: 32,
  alignItems: 'start',
  '@media': {
    '(max-width: 800px)': { display: 'flex', flexDirection: 'column', gap: 32 },
  },
});

/** 목록이 두 보조 영역 옆에서 독립적으로 늘어나게 한다. */
export const library = style({
  gridColumn: 1,
  gridRow: '1 / span 2',
  minWidth: 0,
  width: '100%',
});

/** 입력 패널의 여백이 그리드 간격과 중첩되지 않게 한다. */
export const add = style({
  gridColumn: 2,
  gridRow: 1,
  margin: 0,
  width: '100%',
});

/** 추천을 등록 아래에서 읽도록 배치한다. */
export const recommend = style({
  gridColumn: 2,
  gridRow: 2,
  margin: 0,
  width: '100%',
});

/** 추천 제목과 필터를 세로로 읽게 한다. */
export const sectionHeading = style({});

/** 짧은 필터 두 개가 보조 영역 안에 머무르게 한다. */
export const filters = style({
  display: 'flex',
  gap: 8,
  marginBottom: 20,
  flexWrap: 'wrap',
});

/** 추천 카드 사이를 테두리와 여백으로 구분한다. */
export const cards = style({ display: 'grid', gap: 24 });

/** 추천을 중첩 패널 없이 목록으로 표현한다. */
export const card = style({
  borderTop: `1px solid ${vars.color.line}`,
  paddingTop: 20,
});

/** 추천 선택을 제목보다 낮은 위계로 둔다. */
export const cardAction = style({
  fontSize: 13,
  marginTop: 8,
  padding: '9px 13px',
});

/** 보조 설명은 목록 제목과 구별한다. */
export const muted = style({ color: vars.color.muted, fontSize: 13 });

/** 등록 제약을 입력 가까이에 표시한다. */
export const small = style({ fontSize: 13, display: 'block' });

/** URL 입력과 제출을 좁은 보조 영역에 맞춰 쌓는다. */
export const row = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  marginTop: 8,
});

/** 등록 폼의 크기 규칙을 다른 폼과 분리한다. */
export const urlForm = style({});

/** 등록 오류를 입력 영역에 연결한다. */
export const error = style({
  color: vars.color.error,
  background: vars.color.errorBackground,
  padding: 12,
  borderRadius: 7,
  margin: '16px 0 0',
});

globalStyle(`.${add} h2, .${recommend} h2`, {
  fontSize: 21,
  lineHeight: 1.4,
  margin: '0 0 18px',
});

globalStyle(`.${card} h3`, {
  fontSize: 18,
  lineHeight: 1.5,
  margin: '0 0 8px',
  overflowWrap: 'anywhere',
});

globalStyle(`.${card} p`, { margin: '8px 0' });

globalStyle(`.${filters} select`, {
  fontSize: 13,
  padding: 8,
  minWidth: 0,
  flex: 1,
});

globalStyle(`.${urlForm} input`, { width: '100%' });
globalStyle(`.${urlForm} p`, { margin: '13px 0' });

globalStyle(`.${add} p`, { marginBottom: 0 });
globalStyle(`.${urlForm} label`, { fontSize: 13, display: 'block' });

/** 시안의 등록 버튼 높이를 패널 폭에 맞춘다. */
export const submit = style({ padding: '9px 13px' });

globalStyle(`.${urlForm} input::placeholder`, {
  color: vars.color.muted,
  opacity: 1,
});
