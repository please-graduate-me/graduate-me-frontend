import { createVar, style } from '@vanilla-extract/css';

/** 원본 SVG를 수정하지 않고 컨트롤의 현재 색으로 표시한다. */
export const source = createVar();

/** Figma에서 내려받은 선형 아이콘의 비율을 유지한다. */
export const root = style({
  display: 'inline-block',
  flex: 'none',
  background: 'currentColor',
  maskImage: source,
  maskSize: 'contain',
  maskPosition: 'center',
  maskRepeat: 'no-repeat',
  verticalAlign: 'middle',
});
