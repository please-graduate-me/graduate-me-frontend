import { style } from '@vanilla-extract/css';

/** 정사각형 캔버스로 캐릭터의 비율과 화면 배치를 유지한다. */
export const frame = style({
  position: 'relative',
  flexShrink: 0,
  display: 'inline-block',
  verticalAlign: 'middle',
  pointerEvents: 'none',
});
