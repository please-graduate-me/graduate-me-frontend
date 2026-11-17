import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 모아보기 열과 질문 목록 열을 나란히 두고 좁은 화면에서는 위아래로 쌓는다. */
export const root = style({
  maxWidth: 1120,
  marginInline: 'auto',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: vars.space.xl,
  minWidth: 0,
});

/** 모아보기 조건은 고정 폭 열로 두어 목록 폭 변화에 흔들리지 않게 한다. */
export const aside = style({
  flex: '1 1 220px',
  maxWidth: 260,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
  '@media': { '(max-width: 820px)': { maxWidth: 'none' } },
});

/** 답변 상태 선택지를 세로 행으로 나열한다. */
export const views = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xxs,
});

/** 언어 선택 제목과 선택지를 한 묶음으로 둔다. */
export const languages = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

/** 언어 선택지는 알약 버튼을 한 줄에 흘려 배치한다. */
export const languageOptions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
});

/** 긴 질문 제목이 모아보기 열을 밀지 않게 본문이 남은 폭을 차지한다. */
export const main = style({
  flex: '999 1 560px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.comfortable,
});

/** 제목과 질문하기 동작을 아래 기준선에 맞춰 한 행에 둔다. */
export const intro = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: vars.space.md,
});

/** 제목 아래 설명은 제목보다 낮은 위계로 붙인다. */
export const description = style({ marginTop: 6 });

/** 질문 카드를 목록 표식 없이 일정한 간격으로 쌓는다. */
export const list = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.compact,
});
