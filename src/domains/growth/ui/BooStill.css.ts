import { style } from '@vanilla-extract/css';

/** 캐릭터 원본을 잘리지 않게 부모 영역 안에 맞춘다. */
export const image = style({
  position: 'absolute',
  inset: 0,
  backgroundImage: 'url(/characters/boo/encouraging.png)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'contain',
});
