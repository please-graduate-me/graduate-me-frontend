import { style } from '@vanilla-extract/css';

/** 표현 목록과 선택 상세를 같은 너비로 비교한다. */
export const columns = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  gap: 28,
  alignItems: 'start',
});
