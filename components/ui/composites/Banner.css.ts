import { style, styleVariants } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 안내 상자의 공통 여백과 글자 크기다. */
export const root = style(
  layered({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space.xxs,
    minWidth: 0,
    padding: `${vars.space.compact} ${vars.space.md}`,
    border: '1px solid transparent',
    borderRadius: vars.radius.control,
    color: vars.color.ink,
    fontSize: vars.fontSize.small,
    lineHeight: vars.lineHeight.small,
    overflowWrap: 'anywhere',
  })
);

/** 상태마다 옅은 바탕과 테두리 색을 짝지어 의미를 구분한다. */
export const status = styleVariants(
  {
    info: {
      background: vars.color.infoBackground,
      borderColor: vars.color.infoBackground,
    },
    warning: {
      background: vars.color.notice,
      borderColor: vars.color.quoteLine,
    },
    error: {
      background: vars.color.errorBackground,
      borderColor: vars.color.errorBackground,
    },
  },
  layered
);

/** 본문이 따로 있을 때 제목을 상태의 진한 색과 굵은 글자로 먼저 읽히게 한다. */
export const title = style(layered({ fontWeight: vars.fontWeight.bold }));

/** 제목 글자색을 상태 의미에 맞춘다. */
export const titleTone = styleVariants(
  {
    info: { color: vars.color.info },
    warning: { color: vars.color.warning },
    error: { color: vars.color.error },
  },
  layered
);
