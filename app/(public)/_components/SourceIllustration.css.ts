import { style } from '@vanilla-extract/css';

/** PDF 묶음과 영상 화면 도형을 나란히 놓는다. */
export const root = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 20,
  width: '100%',
});

/** 좁은 그림판에서도 두 도형이 넘치지 않게 비율을 유지한 채 줄어들게 한다. */
export const shape = style({
  flex: '0 1 auto',
  minWidth: 0,
  maxWidth: '45%',
  height: 'auto',
});
