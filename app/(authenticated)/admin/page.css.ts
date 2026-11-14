import { style } from '@vanilla-extract/css';

/** 학생 앱 안에서 운영 도구를 혼합하지 않고 별도 작업 공간으로 안내한다. */
export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 20,
  maxWidth: 760,
  padding: 32,
  marginTop: 16,
});
