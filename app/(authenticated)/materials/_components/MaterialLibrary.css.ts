import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 자료 보관함의 각 원문을 시안의 한 줄 탐색으로 배치한다. */
export const list = style({ listStyle: 'none', margin: 0, padding: 0 });

/** 길어진 제목과 관리 동작이 겹치지 않게 열 너비를 나눈다. */
export const row = style({
  display: 'flex',
  gap: 16,
  alignItems: 'center',
  minHeight: 100,
  paddingBlock: 20,
  borderBottom: `1px solid ${vars.color.line}`,
});

/** 문서와 영상의 성격을 작은 표지로 구별한다. */
export const cover = style({
  width: 38,
  height: 44,
  display: 'grid',
  placeItems: 'center',
  borderRadius: vars.radius.control,
  flex: 'none',
  color: vars.color.documentInk,
  background: vars.color.document,
  selectors: {
    '&[data-kind="video"]': {
      color: vars.color.review,
      background: vars.color.reviewBackground,
    },
  },
});

/** 원문 제목과 메타데이터를 읽는 순서대로 유지한다. */
export const info = style({ flex: 1, minWidth: 0, overflowWrap: 'anywhere' });

/** 준비 상태와 실제 최근 활동은 원문 오른쪽에서 함께 확인한다. */
export const status = style({
  display: 'grid',
  justifyItems: 'end',
  gap: 8,
  minWidth: 140,
});

/** 원본 교체와 삭제는 펼친 관리 메뉴에서 명시적으로 선택한다. */
export const menu = style({ position: 'relative', margin: 0 });

/** 추가 관리 동작이 기존 목록의 높이를 밀지 않게 한다. */
export const actions = style({
  position: 'absolute',
  right: 0,
  top: 'calc(100% + 8px)',
  display: 'grid',
  gap: 8,
  padding: 12,
  zIndex: 5,
  background: vars.color.surface,
  boxShadow: vars.shadow.popover,
  border: `1px solid ${vars.color.line}`,
  borderRadius: vars.radius.control,
});
