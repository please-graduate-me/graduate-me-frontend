import { globalFontFace, globalStyle } from '@vanilla-extract/css';
import { resetLayer } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

globalFontFace('Noto Sans KR', {
  src: 'url(/fonts/noto-sans-kr.woff2) format("woff2")',
  fontStyle: 'normal',
  fontWeight: '100 900',
  fontDisplay: 'swap',
});

globalFontFace('Space Grotesk', {
  src: 'url(/fonts/space-grotesk.woff2) format("woff2")',
  fontStyle: 'normal',
  fontWeight: '300 700',
  fontDisplay: 'swap',
});

globalFontFace('Source Serif 4', {
  src: 'url(/fonts/source-serif-4.woff2) format("woff2")',
  fontStyle: 'normal',
  fontWeight: '200 900',
  fontDisplay: 'swap',
});

// 서비스는 밝은 화면만 지원하므로 OS 어두운 모드에서도 기본 제어와 스크롤 막대를 밝게 둔다.
globalStyle(':root', { colorScheme: 'light' });

// 초기화는 가장 낮은 계층에 두어 공통 UI의 글꼴, 색, 포커스 표시를 덮지 않게 한다.
globalStyle('*, *::before, *::after', {
  '@layer': { [resetLayer]: { boxSizing: 'border-box' } },
});

globalStyle('body', {
  margin: 0,
  minWidth: 320,
  background: vars.color.background,
  color: vars.color.ink,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.body,
  lineHeight: '1.6',
  WebkitFontSmoothing: 'antialiased',
});

globalStyle('h1, h2, h3, h4, h5, h6, p, figure, blockquote', {
  '@layer': { [resetLayer]: { margin: 0 } },
});

globalStyle('button, input, select, textarea', {
  '@layer': { [resetLayer]: { font: 'inherit', color: 'inherit' } },
});

globalStyle(':focus-visible', {
  '@layer': {
    [resetLayer]: {
      outline: `2px solid ${vars.color.focus}`,
      outlineOffset: 2,
    },
  },
});

globalStyle('fieldset', {
  '@layer': { [resetLayer]: { border: 0, padding: 0, margin: 0, minWidth: 0 } },
});

// 모션 축소 설정에서는 개별 컴포넌트가 빠뜨린 애니메이션까지 한 번에 멈춘다.
globalStyle('*, *::before, *::after', {
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animationDuration: '0.01ms',
      animationIterationCount: '1',
      transitionDuration: '0.01ms',
      scrollBehavior: 'auto',
    },
  },
});
