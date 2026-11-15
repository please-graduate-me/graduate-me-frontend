import { style, styleVariants } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 안내 상자의 공통 여백과 글자 크기이며 아이콘이 있으면 본문 앞에 나란히 둔다. */
export const root = style(
  layered({
    display: 'flex',
    alignItems: 'flex-start',
    gap: vars.space.sm,
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

/** 제목 줄과 본문을 세로로 쌓는다. */
export const content = style(
  layered({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space.xxs,
    flex: '1 1 auto',
    minWidth: 0,
  })
);

/** 짧은 제목을 본문 앞에 한 줄로 붙이고 좁으면 본문만 다음 줄로 넘긴다. */
export const inline = style(
  layered({
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: vars.space.sm,
    rowGap: vars.space.xxs,
    flex: '1 1 auto',
    minWidth: 0,
  })
);

/** 한 줄 배치의 제목은 줄어들지 않고 본문이 남은 폭을 쓴다. */
export const inlineTitle = style(layered({ flexShrink: 0 }));

/** 상태마다 옅은 바탕과 테두리 색을 짝지어 의미를 구분한다. */
export const status = styleVariants(
  {
    info: {
      background: vars.color.infoBackground,
      borderColor: vars.color.infoBackground,
    },
    note: {
      background: vars.color.canvas,
      borderColor: vars.color.canvas,
    },
    success: {
      background: vars.color.selected,
      borderColor: vars.color.selected,
    },
    quote: {
      background: vars.color.quote,
      borderColor: vars.color.quoteLine,
    },
    review: {
      background: vars.color.reviewBackground,
      borderColor: vars.color.reviewBackground,
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

/** 오류처럼 눈에 띄어야 하는 상자는 같은 계열의 진한 테두리를 둔다. */
export const outline = styleVariants(
  {
    info: { borderColor: vars.color.info },
    note: { borderColor: vars.color.line },
    success: { borderColor: vars.color.accentLine },
    quote: { borderColor: vars.color.quoteLine },
    review: { borderColor: vars.color.review },
    warning: { borderColor: vars.color.quoteLine },
    error: { borderColor: vars.color.errorLine },
  },
  layered
);

/** 첫 줄 글자 높이에 맞춘 앞 아이콘이다. */
export const icon = style(layered({ marginTop: 2 }));

/** 아이콘 색을 상태 의미에 맞추며 회색 안내는 파란 정보 색을 쓴다. */
export const iconTone = styleVariants(
  {
    info: { color: vars.color.info },
    note: { color: vars.color.info },
    success: { color: vars.color.accent },
    quote: { color: vars.color.warning },
    review: { color: vars.color.review },
    warning: { color: vars.color.warning },
    error: { color: vars.color.error },
  },
  layered
);

/** 본문이 따로 있을 때 제목을 상태의 진한 색과 굵은 글자로 먼저 읽히게 한다. */
export const title = style(layered({ fontWeight: vars.fontWeight.bold }));

/** 제목 글자색을 상태 의미에 맞춘다. */
export const titleTone = styleVariants(
  {
    info: { color: vars.color.info },
    note: { color: vars.color.ink },
    success: { color: vars.color.accent },
    quote: { color: vars.color.warning },
    review: { color: vars.color.review },
    warning: { color: vars.color.warning },
    error: { color: vars.color.error },
  },
  layered
);
