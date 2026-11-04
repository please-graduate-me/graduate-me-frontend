import { style, styleVariants, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 목록 내부 여백과 외부 그리드 간격의 중복을 막는다. */
export const root = style({ margin: 0 });

/** 검색을 넓게 두고 분류와 정렬을 나란히 제공한다. */
export const controls = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 12,
  marginBottom: 24,
});

globalStyle(`.${controls} label`, {
  fontSize: 13,
  fontWeight: 600,
  minWidth: 0,
});

globalStyle(`.${controls} label:first-child`, { gridColumn: '1 / -1' });

globalStyle(`.${controls} input, .${controls} select`, {
  display: 'block',
  fontSize: 14,
  fontWeight: 400,
  marginTop: 5,
  width: '100%',
});

/** 자주 쓰는 표시 조건을 펼쳐 바로 선택하게 한다. */
export const filters = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  marginBottom: 20,
});

/** 눌린 필터를 색과 접근성 상태로 함께 구별한다. */
export const filterButton = style({
  fontSize: 13,
  padding: '8px 10px',
  selectors: {
    '&[aria-pressed="true"]': {
      background: '#e9effe',
      color: vars.color.accent,
      borderColor: vars.color.inputBorder,
    },
  },
});

/** 결과 수와 진도를 보조 정보로 읽게 한다. */
export const count = style({
  fontSize: 13,
  color: vars.color.muted,
  marginBottom: 12,
  fontVariantNumeric: 'tabular-nums',
});

/** 목록 기본 들여쓰기를 제거한다. */
export const list = style({ listStyle: 'none', margin: 0, padding: 0 });

/** 행마다 제목과 행동을 한 묶음으로 구분한다. */
export const item = style({
  borderTop: `1px solid ${vars.color.line}`,
  padding: '24px 0',
});

/** 긴 제목도 상태 배지를 밀어내지 않게 한다. */
export const titleRow = style({
  display: 'flex',
  gap: 12,
  alignItems: 'start',
  justifyContent: 'space-between',
  '@media': { '(max-width: 800px)': { display: 'block' } },
});

globalStyle(`.${titleRow} h3`, {
  fontSize: 18,
  lineHeight: 1.5,
  margin: '0 0 8px',
  overflowWrap: 'anywhere',
});

globalStyle(`.${titleRow} a`, {
  color: vars.color.ink,
  textDecoration: 'none',
});

globalStyle(`.${titleRow} a:hover`, {
  color: vars.color.accent,
  textDecoration: 'underline',
});

const badge = style({
  fontSize: 12,
  padding: '3px 7px',
  borderRadius: 4,
  whiteSpace: 'nowrap',
  '@media': { '(max-width: 800px)': { display: 'inline-block', marginTop: 2 } },
});

/** 준비와 처리 중, 실패를 글자와 색으로 함께 알린다. */
export const status = styleVariants({
  ready: [badge, { background: vars.color.success, color: vars.color.match }],
  working: [badge, { background: vars.color.notice, color: '#725009' }],
  failed: [
    badge,
    { background: vars.color.errorBackground, color: vars.color.error },
  ],
});

/** 분류와 반응 수는 제목의 읽기를 방해하지 않게 한다. */
export const description = style({
  color: vars.color.muted,
  fontSize: 13,
  margin: '8px 0',
});

/** 진행 위치를 짧은 선으로 표시하고 수치는 별도 텍스트로 제공한다. */
export const progress = style({
  height: 4,
  background: '#e9effe',
  maxWidth: 220,
  borderRadius: 4,
  margin: '12px 0 6px',
});

globalStyle(`.${progress} span`, {
  display: 'block',
  height: 4,
  background: vars.color.accent,
  borderRadius: 4,
});

/** 목록 행동을 한 묶음으로 유지하면서 줄바꿈을 허용한다. */
export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 16,
});

/** 행별 행동은 탐색 제목보다 낮은 위계로 둔다. */
export const actionButton = style({ fontSize: 12, padding: '7px 10px' });

/** 제거가 관심 표시보다 먼저 눈에 들어오지 않게 한다. */
export const removeButton = style([
  actionButton,
  { borderColor: 'transparent', color: vars.color.muted },
]);

/** 실패 안내와 재시도를 목록 가까이에 유지한다. */
export const error = style({
  color: vars.color.error,
  background: vars.color.errorBackground,
  padding: 12,
  borderRadius: 7,
});

globalStyle(`.${root} h2`, {
  fontSize: 21,
  lineHeight: 1.4,
  margin: '0 0 18px',
});

/** 구절을 기다리는 설명의 문단 간격을 유지한다. */
export const pending = style([count, { margin: '13px 0' }]);

globalStyle(`.${controls} input::placeholder`, {
  color: vars.color.muted,
  opacity: 1,
});
