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

globalStyle('*', { boxSizing: 'border-box' });

globalStyle('body', {
  margin: '0',
  background: vars.color.background,
  color: vars.color.ink,
  fontFamily: vars.font.body,
  lineHeight: '1.6',
  minWidth: '1200px',
});

globalStyle('a', { color: vars.color.accent, textUnderlineOffset: '4px' });
globalStyle('h1, h2, h3, p', { marginTop: '0' });

globalStyle('h1', {
  fontSize: vars.fontSize.heading2,
  lineHeight: '34px',
  letterSpacing: '-0.5px',
  marginBottom: '18px',
});

globalStyle('h2', { fontSize: vars.fontSize.heading3, lineHeight: '28px' });

globalStyle('h3', {
  fontSize: vars.fontSize.body,
  lineHeight: vars.lineHeight.body,
});

globalStyle('section', { marginBottom: vars.space.xl });
globalStyle('button, input, textarea, select', { font: 'inherit' });

globalStyle(':focus-visible', {
  outline: `3px solid ${vars.color.focus}`,
  outlineOffset: '3px',
});

globalStyle('input, textarea, select', {
  border: `1px solid ${vars.color.inputBorder}`,
  borderRadius: vars.radius.control,
  padding: '10px 12px',
  color: vars.color.ink,
  background: vars.color.surface,
});

globalStyle('input, textarea', { minWidth: '0' });

globalStyle('textarea', {
  width: '100%',
  minHeight: '155px',
  resize: 'vertical',
  margin: '8px 0 16px',
  fontSize: vars.fontSize.small,
});

globalStyle('label', { fontSize: '14px', fontWeight: '600' });
globalStyle('details', { marginTop: '20px', fontSize: '14px' });
globalStyle('summary', { cursor: 'pointer' });

globalStyle('progress', {
  width: '100%',
  height: '6px',
  accentColor: vars.color.accent,
  margin: '16px 0 8px',
});

globalStyle(':root', { colorScheme: 'light' });
