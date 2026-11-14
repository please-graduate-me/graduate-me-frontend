import { globalFontFace, globalStyle } from '@vanilla-extract/css';
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

// Astryx를 걷어 내는 동안 남은 Astryx 컴포넌트도 서비스 글꼴을 쓰게 한다.
globalStyle(':root, [data-astryx-theme="pgm"]', {
  colorScheme: 'light',
  vars: {
    '--font-family-body': vars.font.body,
    '--font-family-heading': vars.font.body,
  },
});

globalStyle('*, *::before, *::after', { boxSizing: 'border-box' });

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

globalStyle('h1, h2, h3, h4, h5, h6, p, figure, blockquote', { margin: 0 });

globalStyle('button, input, select, textarea', {
  font: 'inherit',
  color: 'inherit',
});

globalStyle(':focus-visible', {
  outline: `2px solid ${vars.color.focus}`,
  outlineOffset: 2,
});

globalStyle('fieldset', { border: 0, padding: 0, margin: 0, minWidth: 0 });

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
