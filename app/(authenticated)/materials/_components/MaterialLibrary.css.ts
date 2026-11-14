import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 머리말, 분류 도구, 자료 묶음을 넉넉한 간격으로 쌓는다. */
export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xl,
  minWidth: 0,
});

/** 큰 제목과 자료 추가 행동을 아래 기준선에 맞춰 양끝에 둔다. */
export const header = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: vars.space.md,
});

/** 종류 분류와 언어·이름 검색을 한 줄에 두고 좁으면 접는다. */
export const toolbar = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: vars.space.compact,
});

/** 종류 분류 버튼을 붙여 둔다. */
export const tabs = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xs,
});

/** 언어 선택과 이름 검색을 입력 아래선에 맞춘다. */
export const filters = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  gap: vars.space.sm,
});

/** 언어 선택이 좁은 줄에서도 선택지 이름을 자르지 않게 최소 폭을 둔다. */
export const language = style({ minWidth: 150 });

/** 학습 중인 자료와 완료한 자료 묶음 사이를 크게 띄운다. */
export const sections = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 44,
});
