import { style, styleVariants } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 줄바꿈 기준과 글꼴처럼 모든 글자 유형이 공유하는 기본값이다. */
export const root = style(layered({ overflowWrap: 'break-word', margin: 0 }));

/** 본문, 보조 설명, 큰 본문과 주변 글자 상속의 크기와 색을 정한다. */
export const type = styleVariants(
  {
    body: {
      fontSize: vars.fontSize.body,
      lineHeight: vars.lineHeight.body,
      fontWeight: vars.fontWeight.regular,
      color: vars.color.ink,
    },
    supporting: {
      fontSize: vars.fontSize.small,
      lineHeight: vars.lineHeight.small,
      fontWeight: vars.fontWeight.regular,
      color: vars.color.muted,
    },
    large: {
      fontSize: vars.fontSize.lead,
      lineHeight: '1.6',
      fontWeight: vars.fontWeight.regular,
      color: vars.color.ink,
    },
    inherit: {
      fontSize: 'inherit',
      lineHeight: 'inherit',
      fontWeight: 'inherit',
      color: 'inherit',
    },
    stat: {
      fontFamily: vars.font.numeric,
      fontSize: vars.fontSize.heading2,
      lineHeight: '1.15',
      fontWeight: vars.fontWeight.bold,
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.01em',
      color: vars.color.ink,
    },
  },
  layered
);

/** 유형의 크기는 두고 글자 크기만 바꾸며 xl·display는 통계 숫자용 큰 단계다. */
export const size = styleVariants(
  {
    sm: { fontSize: vars.fontSize.small },
    lg: { fontSize: vars.fontSize.lead },
    xl: { fontSize: vars.fontSize.heading1 },
    display: { fontSize: '40px' },
  },
  layered
);

/** 유형 기본색 대신 보조색이나 주변 색을 쓴다. */
export const color = styleVariants(
  { secondary: { color: vars.color.muted }, inherit: { color: 'inherit' } },
  layered
);

/** 시안의 굵은 제목 위계에 맞춰 강조 굵기를 한 단계씩 올려 쓴다. */
export const weight = styleVariants(
  {
    semibold: { fontWeight: vars.fontWeight.bold },
    bold: { fontWeight: vars.fontWeight.heavy },
  },
  layered
);

/** 기본 인라인 대신 블록으로 배치한다. */
export const block = style(layered({ display: 'block' }));

/** 가운데 정렬한다. */
export const center = style(layered({ textAlign: 'center' }));

/** 숫자 폭을 맞춰 시간과 점수가 흔들리지 않게 한다. */
export const tabular = style(layered({ fontVariantNumeric: 'tabular-nums' }));

/** XP·쪽수·순위 같은 숫자를 시안의 숫자 서체로 쓰고 폭을 맞춘다. */
export const numeric = style(
  layered({ fontFamily: vars.font.numeric, fontVariantNumeric: 'tabular-nums' })
);

/** 한 줄을 넘는 글자를 말줄임표로 자른다. */
export const singleLine = style(
  layered({
    display: 'block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  })
);

/** 지정한 줄 수를 넘는 글자를 자르며 줄 수는 컴포넌트가 인라인으로 넘긴다. */
export const multiLine = style(
  layered({
    display: '-webkit-box',
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
  })
);
