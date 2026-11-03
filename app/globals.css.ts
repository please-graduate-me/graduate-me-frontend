import { globalStyle } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

globalStyle('*', { boxSizing: 'border-box' });

globalStyle('body', {
  margin: '0',
  background: vars.color.background,
  color: vars.color.ink,
  fontFamily: vars.font.body,
  lineHeight: '1.6',
});

globalStyle('a', { color: vars.color.accent, textUnderlineOffset: '4px' });
globalStyle('h1, h2, h3, p', { marginTop: '0' });

globalStyle('h1', {
  fontSize: 'clamp(28px, 4vw, 42px)',
  lineHeight: '1.3',
  letterSpacing: '-1px',
  marginBottom: '18px',
});

globalStyle('h2', { fontSize: '21px' });
globalStyle('h3', { fontSize: '18px' });
globalStyle('section', { marginBottom: '32px' });
globalStyle('button, input, textarea, select', { font: 'inherit' });

globalStyle(':focus-visible', {
  outline: `3px solid ${vars.color.focus}`,
  outlineOffset: '3px',
});

globalStyle('input, textarea, select', {
  border: `1px solid ${vars.color.inputBorder}`,
  borderRadius: '7px',
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
  fontSize: '18px',
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
