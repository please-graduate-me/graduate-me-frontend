import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 스크립트 카드는 넓은 화면에서 영상과 함께 스크롤한다. */
export const sidebar = style({
  display: 'grid',
  gap: vars.space.md,
  minWidth: 0,
  position: 'sticky',
  top: vars.space.lg,
  '@media': { '(max-width: 1100px)': { position: 'static' } },
});

/** 스크립트 제목과 검색 표식을 같은 기준선에 둔다. */
export const heading = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

/** 구절 탐색 안내를 테마의 보조 위계로 표시한다. */
export const description = style({
  color: vars.color.muted,
  marginBlock: vars.space.sm,
});

/** 긴 스크립트 목록은 카드 안에서 탐색하게 한다. */
export const list = style({
  maxHeight: 'calc(100vh - 330px)',
  overflowY: 'auto',
  minHeight: 80,
});

/** 원문 저장 조작과 구절 탐색을 공간으로 분리한다. */
export const actions = style({ display: 'grid', gap: vars.space.md });

/** 원문 선택은 글꼴 크기와 관계없이 드래그와 키보드로 제공한다. */
export const selectable = style({
  userSelect: 'text',
  lineHeight: 1.9,
  overflowWrap: 'anywhere',
});
