import { style } from '@vanilla-extract/css';

/** 부모 크기를 기준으로 런타임이 내부 캔버스 해상도를 맞춘다. */
export const canvas = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
});
