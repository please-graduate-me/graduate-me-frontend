import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** OCR 텍스트는 해당 원본의 비율 좌표 위에서만 선택한다. */
export const layer = style({
  position: 'absolute',
  inset: 0,
  overflow: 'clip',
  fontSize: 0,
  userSelect: 'text',
  color: 'transparent',
  selectors: {
    '&[data-interactive="false"]': {
      pointerEvents: 'none',
      userSelect: 'none',
    },
  },
});

/** 실제 글자 너비를 측정해 OCR 인식 상자에 맞춘다. */
export const word = style({
  position: 'absolute',
  whiteSpace: 'pre',
  lineHeight: 1,
  transformOrigin: 'top left',
  color: 'transparent',
  cursor: 'text',
  userSelect: 'text',
  selectors: {
    '&[data-review-needed="true"]': {
      borderBottom: `2px dotted ${vars.color.warning}`,
      boxSizing: 'border-box',
    },
  },
});

globalStyle(`${layer} ::selection`, {
  background: 'rgb(255 213 61 / 45%)',
  color: 'transparent',
});
