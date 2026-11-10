import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 듣기 연습은 실제 원문 영상의 지정 구절을 문제 안에서 재생한다. */
export const audio = style({
  width: '100%',
  maxWidth: 640,
  aspectRatio: '16 / 9',
  border: 0,
  borderRadius: vars.radius.control,
  background: vars.color.video,
});
