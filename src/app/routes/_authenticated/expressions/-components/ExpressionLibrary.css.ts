import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 제목, 종류 칩, 목록과 상세를 세로로 쌓는다. */
export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
  minWidth: 0,
});

/** 제목과 표현 추가 동작을 아래 기준선으로 맞춘다. */
export const header = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: vars.space.md,
});

/** 제목 아래 설명이다. */
export const description = style({
  marginTop: vars.space.xs,
  fontSize: 15,
});

/** 저장 종류 칩을 여러 줄로 감싼다. */
export const kinds = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xs,
});

/** 칩 안의 개수는 숫자 글꼴로 조금 옅게 둔다. */
export const kindCount = style({
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.label,
  opacity: 0.8,
});

/** 목록과 상세를 나란히 두고 좁은 화면에서는 상세를 아래로 내린다. */
export const columns = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: 28,
});

/** 검색, 필터, 목록을 세로로 쌓는 왼쪽 열이다. */
export const listColumn = style({
  flex: '1 1 400px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.compact,
});

/** 네 가지 선택 필터를 두 열 격자로 놓는다. */
export const filters = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 8,
});

/** 정렬 기준과 결과 수 표시다. */
export const count = style({
  marginTop: vars.space.xxs,
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
});

/** 표현 카드 사이 간격이다. */
export const list = style({ gap: vars.space.sm });

/** 출처 종류를 알리는 정사각 아이콘 상자다. */
export const source = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: vars.radius.control,
  selectors: {
    '&[data-kind="pdf"]': {
      background: vars.color.extraBackground,
      color: vars.color.extraText,
    },
    '&[data-kind="video"]': {
      background: vars.color.ink,
      color: vars.color.accentBright,
    },
  },
});

/** 표현 원문은 숫자 글꼴 계열로 크게 보여 준다. */
export const itemText = style({
  display: 'block',
  color: vars.color.ink,
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.body,
  fontWeight: vars.fontWeight.bold,
  lineHeight: 1.4,
});

/** 정리한 뜻이다. */
export const itemMeaning = style({
  display: 'block',
  marginTop: vars.space.xxs,
  color: '#33363F',
  fontSize: vars.fontSize.small,
  lineHeight: 1.5,
});

/** 뜻을 아직 정리하지 않은 안내는 기울여 구분한다. */
export const empty = style({
  color: vars.color.subtle,
  fontStyle: 'italic',
});

/** 출처 위치와 자료 제목이다. */
export const itemSource = style({
  display: 'block',
  marginTop: vars.space.xs,
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.bold,
});

/** 저장일과 복습 제외 표지를 오른쪽 위에 세운다. */
export const itemEnd = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: vars.space.xs,
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.bold,
  whiteSpace: 'nowrap',
});

/** 다음 복습일과 단계는 숫자 글꼴의 작은 회색 글자로 둔다. */
export const itemReview = style({
  fontFamily: vars.font.numeric,
  fontVariantNumeric: 'tabular-nums',
});
