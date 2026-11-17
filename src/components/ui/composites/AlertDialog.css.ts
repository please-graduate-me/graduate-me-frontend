import { style, styleVariants } from '@vanilla-extract/css';
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

/** 제목 위 44px 원형 상태 아이콘이다. */
export const icon = style(
  layered({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: '50%',
  })
);

/** 위험 작업은 빨간 원, 그 밖의 확인은 회색 원으로 칠한다. */
export const iconTone = styleVariants(
  {
    danger: { background: vars.color.errorBackground, color: vars.color.error },
    neutral: { background: vars.color.canvas, color: vars.color.ink },
  },
  layered
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

/** 제외할 구성원의 이름·역할처럼 작업 대상을 다시 보여 주는 회색 상자다. */
export const detail = style(
  layered({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: vars.space.xs,
    padding: `${vars.space.sm} ${vars.space.compact}`,
    borderRadius: vars.radius.control,
    background: vars.color.canvas,
    color: vars.color.ink,
    fontSize: vars.fontSize.small,
    fontWeight: vars.fontWeight.heavy,
    lineHeight: vars.lineHeight.small,
    overflowWrap: 'anywhere',
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
