import { style } from '@vanilla-extract/css';

/** 보상 토스트는 학습 입력을 가리지 않는 화면 모서리에 배치한다. */
export const toast = style({
  position: 'fixed',
  bottom: 24,
  right: 24,
  zIndex: 1000,
  width: 'min(420px, calc(100vw - 32px))',
  '@media': { '(max-width: 600px)': { bottom: 16, right: 16 } },
});
