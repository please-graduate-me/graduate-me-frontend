import { style, styleVariants } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 빈 목록 자리를 회색 면 가운데 정렬로 채운다. */
export const root = style(
  layered({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: vars.space.sm,
    padding: `${vars.space.xl} ${vars.space.lg}`,
    borderRadius: vars.radius.panel,
    background: vars.color.canvas,
    textAlign: 'center',
    overflowWrap: 'anywhere',
  })
);

/** 회색 면은 기본, 점선은 흰 바탕 1.5px 점선 테두리 상자다. */
export const variant = styleVariants(
  {
    filled: {},
    dashed: {
      gap: vars.space.compact,
      padding: `${vars.space.section} ${vars.space.lg}`,
      border: `1.5px dashed ${vars.color.lineStrong}`,
      borderRadius: vars.radius.tray,
      background: 'transparent',
    },
  },
  layered
);

/** 상황을 알려 주는 아이콘 원이다. */
export const icon = style(
  layered({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    marginBottom: vars.space.xxs,
    borderRadius: '50%',
  })
);

/** 아이콘 원을 청록 강조나 회색 중립으로 칠한다. */
export const iconTone = styleVariants(
  {
    accent: { background: vars.color.selected, color: vars.color.accent },
    neutral: { background: vars.color.canvas, color: vars.color.muted },
  },
  layered
);

/** 점선 상자의 56px 아이콘 자리다. */
export const iconLarge = style(layered({ width: 56, height: 56 }));

/** 둥근 사각 아이콘 타일이다. */
export const iconSquare = style(layered({ borderRadius: '16px' }));

/** 빈 상태의 제목이다. */
export const title = style(
  layered({
    margin: 0,
    fontSize: vars.fontSize.body,
    lineHeight: vars.lineHeight.small,
    fontWeight: vars.fontWeight.heavy,
    color: vars.color.ink,
  })
);

/** 점선 상자의 큰 제목이다. */
export const titleLarge = style(
  layered({
    fontSize: vars.fontSize.heading3,
    lineHeight: vars.lineHeight.heading,
  })
);

/** 다음 행동을 돕는 설명이다. */
export const description = style(
  layered({
    maxWidth: 420,
    margin: 0,
    fontSize: vars.fontSize.small,
    lineHeight: vars.lineHeight.small,
    color: vars.color.muted,
  })
);

/** 후속 동작 버튼과 링크를 가운데로 모은다. */
export const actions = style(
  layered({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: vars.space.sm,
    marginTop: vars.space.xs,
  })
);
