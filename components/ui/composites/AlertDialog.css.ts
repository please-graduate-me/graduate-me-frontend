import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 제목과 설명 영역이다. */
export const body = style(
  layered({
    display: 'grid',
    gap: vars.space.sm,
    padding: `${vars.space.lg} ${vars.space.lg} ${vars.space.md}`,
  })
);

/** 확인 제목이다. */
export const title = style(
  layered({
    margin: 0,
    color: vars.color.ink,
    fontSize: vars.fontSize.heading3,
    fontWeight: vars.fontWeight.heavy,
    lineHeight: vars.lineHeight.heading,
  })
);

/** 확인할 내용 설명이다. */
export const description = style(
  layered({
    margin: 0,
    color: vars.color.muted,
    fontSize: vars.fontSize.small,
    lineHeight: vars.lineHeight.small,
    whiteSpace: 'pre-line',
  })
);

/** 취소와 실행 버튼 줄이며 좁은 화면에서는 세로로 쌓는다. */
export const actions = style(
  layered({
    display: 'flex',
    justifyContent: 'flex-end',
    gap: vars.space.sm,
    padding: `${vars.space.md} ${vars.space.lg} ${vars.space.lg}`,
    '@media': {
      '(max-width: 479px)': {
        flexDirection: 'column-reverse',
        alignItems: 'stretch',
      },
    },
  })
);
