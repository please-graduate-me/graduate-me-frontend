import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 스크립트를 영상과 나란히 읽을 수 있는 전용 열에 둔다. */
export const sidebar = style({
  borderLeft: `1px solid ${vars.color.line}`,
  padding: vars.space.lg,
  minHeight: 'calc(100vh - 84px)',
  position: 'sticky',
  top: 0,
});

/** 스크립트 제목과 검색을 같은 읽기 순서에 둔다. */
export const heading = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: vars.space.md,
});

/** 아직 보지 않은 정답을 숨기는 기준을 알린다. */
export const description = style({
  color: vars.color.muted,
  fontSize: 12,
  lineHeight: 1.7,
  marginBlock: vars.space.md,
});

/** 전체 구절은 패널 내부에서만 스크롤한다. */
export const list = style({
  listStyle: 'none',
  padding: 0,
  margin: '16px 0',
  maxHeight: 'calc(100vh - 330px)',
  overflowY: 'auto',
});

/** 선택한 스크립트는 시안의 옅은 청색 면으로 강조한다. */
export const item = style({
  display: 'block',
  width: '100%',
  padding: '16px 14px',
  marginBottom: vars.space.sm,
  border: 0,
  borderRadius: vars.radius.control,
  background: vars.color.surface,
  textAlign: 'left',
  cursor: 'pointer',
  color: vars.color.muted,
  selectors: {
    '&[aria-current="step"]': {
      color: vars.color.accent,
      background: vars.color.selected,
    },
  },
});

/** 구절의 실제 영상 위치를 표시한다. */
export const time = style({ fontSize: 12, fontVariantNumeric: 'tabular-nums' });

/** 긴 문장이 좁은 스크립트 열 밖으로 나가지 않게 한다. */
export const text = style({
  fontSize: 14,
  lineHeight: 1.8,
  overflowWrap: 'anywhere',
  margin: '8px 0 0',
});

/** 원문 질문과 저장은 탐색 목록 아래에서 찾게 한다. */
export const actions = style({
  paddingTop: vars.space.md,
  borderTop: `1px solid ${vars.color.line}`,
});

globalStyle(`${heading} h2`, { margin: 0, fontSize: 16 });

/** 확인한 원문에서 단어와 복수 단어 표현을 드래그해 선택한다. */
export const selectable = style({
  userSelect: 'text',
  fontSize: 14,
  lineHeight: 1.9,
  padding: vars.space.md,
  borderRadius: vars.radius.control,
  background: vars.color.canvas,
});

/** 구절 탐색과 개인 기록을 같은 밑줄 탭으로 전환한다. */
export const tabs = style({
  display: 'flex',
  gap: 16,
  borderBottom: `1px solid ${vars.color.line}`,
  marginBottom: 16,
});

/** 현재 탭은 문구와 밑줄을 함께 표시한다. */
export const tab = style({
  minHeight: 44,
  padding: '10px 12px',
  border: 0,
  borderBottom: '2px solid transparent',
  background: 'transparent',
  color: vars.color.muted,
  cursor: 'pointer',
  fontSize: 14,
  selectors: {
    '&[aria-pressed="true"]': {
      color: vars.color.ink,
      borderBottomColor: vars.color.accent,
    },
    '&:hover': { background: vars.color.canvas },
  },
});
