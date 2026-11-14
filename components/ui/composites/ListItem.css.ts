import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 앞 내용, 이름과 설명, 뒤 내용을 한 줄로 배치하는 항목이다. */
export const root = style(
  layered({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.compact,
    minWidth: 0,
    padding: `${vars.space.sm} ${vars.space.compact}`,
    borderRadius: vars.radius.control,
    color: vars.color.ink,
    transition: `background-color ${vars.motion.fast} ${vars.motion.easeOut}`,
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  })
);

/** 누를 수 있는 항목은 가리킬 때 회색 바탕으로 반응한다. */
export const interactive = style(
  layered({
    selectors: { '&:hover': { background: vars.color.canvas } },
  })
);

/** 선택된 항목을 옅은 청록 바탕으로 표시한다. */
export const selected = style(
  layered({
    background: vars.color.selected,
    selectors: { '&:hover': { background: vars.color.selectedHover } },
  })
);

/** 사용할 수 없는 항목을 흐리게 한다. */
export const disabled = style(layered({ opacity: 0.5 }));

/** 앞뒤 내용은 줄어들지 않고 자기 크기를 지킨다. */
export const slot = style(
  layered({ display: 'flex', alignItems: 'center', flexShrink: 0 })
);

/** 이름과 설명이 남은 폭을 채운다. */
export const content = style(
  layered({
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: '1 1 auto',
    minWidth: 0,
  })
);

/** 항목 동작 버튼으로, 가상 요소가 항목 전체를 덮어 어디를 눌러도 실행된다. */
export const action = style(
  layered({
    padding: 0,
    border: 0,
    background: 'transparent',
    textAlign: 'start',
    cursor: 'pointer',
    selectors: {
      '&::after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        borderRadius: vars.radius.control,
      },
      '&[aria-disabled="true"]': { cursor: 'not-allowed' },
    },
  })
);

/** 항목 이름이다. */
export const label = style(
  layered({
    fontSize: vars.fontSize.small,
    lineHeight: vars.lineHeight.small,
    fontWeight: vars.fontWeight.medium,
    overflowWrap: 'anywhere',
  })
);

/** 설명이 딸린 이름이나 선택된 항목의 이름을 굵게 해 제목처럼 읽히게 한다. */
export const strongLabel = style(layered({ fontWeight: vars.fontWeight.bold }));

/** 이름 아래 보조 설명이다. */
export const description = style(
  layered({
    fontSize: vars.fontSize.small,
    lineHeight: vars.lineHeight.small,
    color: vars.color.muted,
    overflowWrap: 'anywhere',
  })
);
