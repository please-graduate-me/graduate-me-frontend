import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 자료 영역의 제목과 다음 학습 카드 사이를 일정하게 유지한다. */
export const root = style({ margin: '0 0 26px' });

globalStyle('.' + root + ' h2', {
  fontSize: vars.fontSize.body,
  lineHeight: vars.lineHeight.body,
  fontWeight: 500,
  margin: '0 0 22px',
});

/** 최근 자료 카드를 같은 크기의 두 열로 배치한다. */
export const resume = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 18,
});

/** 처음 시작하는 학습자에게도 내용 있는 빈 상태를 제공한다. */
export const empty = style({
  border: '1px solid ' + vars.color.line,
  borderRadius: vars.radius.panel,
});

/** 목록 제목과 전체 보관함 이동을 같은 줄에 둔다. */
export const heading = style({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 12,
});

globalStyle('.' + heading + ' a', {
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
  textDecoration: 'none',
});

/** 자료 종류는 시안의 밑줄 탭으로 바꾼다. */
export const tabs = style({ display: 'flex', gap: 24, marginBottom: 20 });

/** 선택 상태는 밑줄과 글자색으로 함께 전달한다. */
export const tab = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  minWidth: 90,
  minHeight: 44,
  background: 'transparent',
  border: 0,
  borderBottom: '2px solid transparent',
  padding: '8px 12px',
  color: vars.color.muted,
  fontSize: vars.fontSize.small,
  cursor: 'pointer',
  selectors: {
    '&[aria-pressed="true"]': {
      borderBottomColor: vars.color.accent,
      color: vars.color.ink,
    },
    '&:hover': { color: vars.color.accent },
  },
});

/** 목록의 기본 들여쓰기를 제거한다. */
export const list = style({ listStyle: 'none', margin: 0, padding: 0 });

/** 자료의 종류와 정보, 활동 시각을 읽는 순서대로 정렬한다. */
export const item = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 16,
  minHeight: 108,
  padding: '20px 0',
  borderBottom: '1px solid ' + vars.color.line,
});

/** PDF와 영상의 문맥을 다른 바탕색으로 구별한다. */
export const fileType = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 'none',
  width: 38,
  height: 44,
  borderRadius: 6,
  background: vars.color.document,
  color: vars.color.muted,
  selectors: {
    '&[data-kind="video"]': { background: vars.color.reviewBackground },
  },
});

/** 제목이 길어져도 날짜와 관리 동작을 밀어내지 않게 한다. */
export const information = style({ flex: 1, minWidth: 0 });

globalStyle('.' + information + ' h3', {
  margin: '0 0 4px',
  fontSize: vars.fontSize.small,
  lineHeight: vars.lineHeight.small,
  fontWeight: 500,
  overflowWrap: 'anywhere',
});

globalStyle('.' + information + ' h3 a', {
  color: vars.color.ink,
  textDecoration: 'none',
});

globalStyle('.' + information + ' p', {
  fontSize: vars.fontSize.caption,
  color: vars.color.muted,
  margin: '0 0 6px',
});

/** 활동 시각은 자료 제목보다 낮은 위계로 읽게 한다. */
export const updated = style({
  flex: 'none',
  maxWidth: 100,
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
  paddingTop: 2,
});

/** 자주 쓰지 않는 목록 관리 동작은 더보기 안에 둔다. */
export const menu = style({ position: 'relative', margin: 0, flex: 'none' });

globalStyle('.' + menu + ' summary', {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  listStyle: 'none',
  margin: 0,
  borderRadius: vars.radius.control,
  color: vars.color.muted,
});

globalStyle('.' + menu + ' summary::-webkit-details-marker', {
  display: 'none',
});

/** 메뉴는 실제 관리 버튼을 포함하는 작은 팝오버로 표시한다. */
export const menuContent = style({
  position: 'absolute',
  top: 32,
  right: 0,
  zIndex: 5,
  width: 208,
  padding: 6,
  border: '1px solid ' + vars.color.line,
  borderRadius: vars.radius.control,
  background: vars.color.surface,
  boxShadow: vars.shadow.popover,
});

globalStyle('.' + menuContent + ' button', {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  width: '100%',
  minHeight: 36,
  padding: '8px 10px',
  textAlign: 'left',
  border: 0,
  background: 'transparent',
  color: vars.color.ink,
  fontSize: vars.fontSize.caption,
  cursor: 'pointer',
  borderRadius: 4,
});

globalStyle('.' + menuContent + ' button:hover', {
  background: vars.color.selected,
});

/** PDF는 추가 관리 메뉴 없이 원문 이동을 제공한다. */
export const open = style({ color: vars.color.muted, padding: 4 });

/** 목록이 요약임을 알려 전체 자료 수와 혼동하지 않게 한다. */
export const listNote = style({
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
  margin: '16px 0 0',
});

/** 데이터를 기다리는 상태를 빈 목록과 구분한다. */
export const loading = style({
  minHeight: 160,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.muted,
  fontSize: vars.fontSize.small,
});

/** 영상 목록의 실패와 다시 조회 동작을 같은 영역에 둔다. */
export const error = style({
  padding: 16,
  borderRadius: vars.radius.control,
  background: vars.color.errorBackground,
  color: vars.color.error,
  fontSize: vars.fontSize.small,
  marginBottom: 20,
});

globalStyle('.' + error + ' p', { margin: '0 0 12px' });

/** 삭제 확인 대상은 긴 제목도 줄바꿈한다. */
export const removalTitle = style({
  margin: 0,
  overflowWrap: 'anywhere',
  fontWeight: 500,
});
