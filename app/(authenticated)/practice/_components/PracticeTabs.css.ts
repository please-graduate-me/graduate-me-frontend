import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 제목, 연습 방식 탭, 선택한 탭 내용을 세로로 쌓는다. */
export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
  minWidth: 0,
});

/** 제목 아래 설명이다. */
export const description = style({
  marginTop: vars.space.xs,
  fontSize: 15,
});
