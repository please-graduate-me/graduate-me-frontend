import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 저장된 영역은 페이지 비율 좌표로 확대 배율과 무관하게 복원한다. */
export const highlights = style({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 1,
});

/** 강조 색은 원문을 가리지 않는 반투명 오버레이로 표시한다. */
export const highlight = style({
  position: 'absolute',
  background: '#ffe16966',
  mixBlendMode: 'multiply',
  selectors: {
    '&[data-color="blue"]': { background: '#8bbcff66' },
    '&[data-color="green"]': { background: '#9bdab466' },
    // 지금 고른 구절은 저장 하이라이트와 구분되도록 시안의 크림색 둥근 강조로 감싼다.
    '&[data-color="selection"]': {
      background: vars.color.highlight,
      borderRadius: 4,
      boxShadow: `0 0 0 2px ${vars.color.highlight}`,
    },
  },
});

/** 원본 PDF 캔버스와 텍스트 층의 좌표 기준을 일치시키고 회색 바탕 위 종이처럼 띄운다. */
export const page = style({
  position: 'relative',
  background: '#FFFFFF',
  // 크기를 바꾸지 않는 그림자만 써서 선택 좌표 계산에 영향을 주지 않는다.
  boxShadow: '0 1px 3px rgb(22 24 29 / 8%), 0 12px 32px rgb(22 24 29 / 6%)',
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

/** 원문 좌표에 투명 기준점만 두고 툴팁 외형과 포털 배치는 공통 Tooltip에 맡긴다. */
export const meaningAnchor = style({
  position: 'absolute',
  width: 1,
  height: 1,
  pointerEvents: 'none',
});
