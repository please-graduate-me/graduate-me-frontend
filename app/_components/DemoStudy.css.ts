import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';
/** 화면 폭에 맞춰 체험 영상의 비율을 유지한다. */
export const player = style({
  aspectRatio: '16 / 9',
  width: '100%',
  background: vars.color.video,
  marginBlock: vars.space.md,
});
/** 좁은 화면에서는 학습 조작을 다음 줄로 배치한다. */
export const controls = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
  alignItems: 'center',
  marginBlock: vars.space.md,
});
/** 문장 입력이 모바일 화면 밖으로 나가지 않게 한다. */
export const answer = style({
  display: 'block',
  width: '100%',
  minHeight: '90px',
  marginTop: vars.space.sm,
});
/** 빈칸과 주변 단어를 문장 순서로 읽게 한다. */
export const blanks = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.xs,
});
globalStyle(`${blanks} input`, { width: '110px' });
