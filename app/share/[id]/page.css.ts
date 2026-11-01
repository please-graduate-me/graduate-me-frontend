import { style } from '@vanilla-extract/css';
/** 영상과 구절 미리보기의 비율을 작은 화면에서도 유지한다. */
export const player = style({
  width: '100%',
  maxWidth: '800px',
  aspectRatio: '16 / 9',
  border: 0,
  display: 'block',
  marginBottom: '20px',
});
