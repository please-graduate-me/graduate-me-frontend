import { style } from '@vanilla-extract/css';

/** 질문과 답안 입력이 공통 최소 높이를 유지하게 한다. */
export const root = style({
  width: '100%',
  minHeight: 128,
  resize: 'vertical',
  margin: 0,
});
