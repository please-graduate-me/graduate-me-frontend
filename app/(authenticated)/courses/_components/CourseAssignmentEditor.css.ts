import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 과제 입력을 읽는 순서대로 일정한 간격으로 쌓는다. */
export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

/** 입력 묶음의 기본 테두리와 여백을 없애고 같은 간격으로 쌓는다. */
export const fields = style({
  margin: 0,
  padding: 0,
  border: 0,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

/** 입력 이름과 조작을 가까이 묶는다. */
export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

/** 분할 선택 위 입력 이름은 다른 입력 라벨과 같은 위계로 둔다. */
export const label = style({
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
});

/** 쌍을 이루는 입력은 두 칸으로 나란히 두고 좁은 화면에서는 쌓는다. */
export const pair = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: vars.space.compact,
  '@media': { '(max-width: 480px)': { gridTemplateColumns: 'minmax(0, 1fr)' } },
});

/** 자료 페이지 이동 버튼은 같은 폭으로 나눈다. */
export const pager = style({ display: 'flex', gap: 8, marginTop: 4 });

/** 페이지 이동 버튼이 같은 폭을 갖게 한다. */
export const pagerButton = style({ flex: '1 1 0' });

/** 제출 정책 묶음의 기본 테두리와 여백을 없애고 체크 상자를 격자로 둔다. */
export const policies = style({
  margin: 0,
  padding: 0,
  border: 0,
  minWidth: 0,
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 8,
});

/** 제출 정책 제목은 입력 라벨과 같은 위계로 둔다. */
export const legend = style({
  padding: 0,
  marginBottom: 8,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
});

/** 저장 버튼이 대화상자 폭을 채우게 한다. */
export const submit = style({ width: '100%' });
