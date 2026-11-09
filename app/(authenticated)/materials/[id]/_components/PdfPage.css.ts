import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 원본 PDF 캔버스와 텍스트 층의 좌표 기준을 일치시킨다. */
export const page = style({
  position: 'relative',
  background: vars.color.surface,
  boxShadow: '0 2px 14px rgb(36 49 75 / 8%)',
  flexShrink: 0,
});

/** PDF.js가 생성한 텍스트는 원본 위에서만 선택하게 한다. */
export const textLayer = style({
  position: 'absolute',
  inset: 0,
  overflow: 'clip',
  lineHeight: 1,
  textAlign: 'initial',
  letterSpacing: 'normal',
  wordSpacing: 'normal',
  transformOrigin: '0 0',
  vars: {
    '--scale-round-x': '1px',
    '--scale-round-y': '1px',
    '--text-scale-factor':
      'calc(var(--total-scale-factor) * var(--min-font-size))',
    '--min-font-size-inv': 'calc(1 / var(--min-font-size))',
  },
});

/** 렌더링 실패가 빈 원본처럼 보이지 않게 한다. */
export const error = style({
  padding: vars.space.md,
  color: vars.color.error,
  background: vars.color.errorBackground,
  fontSize: 14,
});

globalStyle(`${page} canvas`, { display: 'block' });

globalStyle(`${textLayer} span, ${textLayer} br`, {
  color: 'transparent',
  position: 'absolute',
  whiteSpace: 'pre',
  cursor: 'text',
  transformOrigin: '0% 0%',
  userSelect: 'text',
});

globalStyle(
  `${textLayer} > :not(.markedContent), ${textLayer} .markedContent span:not(.markedContent)`,
  {
    zIndex: 1,
    fontSize: 'calc(var(--text-scale-factor) * var(--font-height))',
    transform:
      'rotate(var(--rotate, 0deg)) scaleX(var(--scale-x, 1)) scale(var(--min-font-size-inv))',
  }
);

globalStyle(`${textLayer} .markedContent`, { display: 'contents' });

globalStyle(`${textLayer} ::selection`, {
  background: 'rgb(255 213 61 / 45%)',
  color: 'transparent',
});
