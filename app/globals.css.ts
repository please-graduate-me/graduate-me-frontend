import { globalFontFace, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

globalFontFace('DM Sans', {
  src: 'url(/fonts/dm-sans.woff2) format("woff2")',
  fontStyle: 'normal',
  fontWeight: '100 1000',
  fontDisplay: 'swap',
});

globalFontFace('Noto Sans KR', {
  src: 'url(/fonts/noto-sans-kr.woff2) format("woff2")',
  fontStyle: 'normal',
  fontWeight: '100 900',
  fontDisplay: 'swap',
});

globalFontFace('Noto Serif', {
  src: 'url(/fonts/noto-serif.ttf) format("truetype")',
  fontStyle: 'normal',
  fontWeight: '400',
  fontDisplay: 'swap',
});

// 서비스 글꼴만 연결하고 기본 UI 외형은 Astryx 테마가 담당한다.
globalStyle(':root, [data-astryx-theme="pgm"]', {
  colorScheme: 'light',
  vars: {
    '--font-family-body': vars.font.body,
    '--font-family-heading': vars.font.body,
  },
});

globalStyle('body', {
  margin: 0,
  minWidth: 320,
  background: vars.color.background,
  color: vars.color.ink,
  fontFamily: vars.font.body,
  lineHeight: '1.6',
});

globalStyle('fieldset', { border: 0, padding: 0, margin: 0, minWidth: 0 });
