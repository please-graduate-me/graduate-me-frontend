import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 선택되면 청록 테두리와 바탕으로 바뀌는 선택지 줄이다. */
export const item = style(
  layered({
    display: 'flex',
    alignItems: 'flex-start',
    gap: vars.space.compact,
    minHeight: 52,
    padding: `${vars.space.compact} ${vars.space.md}`,
    border: `1px solid ${vars.color.lineStrong}`,
    borderRadius: vars.radius.control,
    background: vars.color.surface,
    color: vars.color.ink,
    fontSize: vars.fontSize.body,
    lineHeight: vars.lineHeight.body,
    cursor: 'pointer',
    transition: `border-color ${vars.motion.fast} ${vars.motion.easeOut}, background-color ${vars.motion.fast} ${vars.motion.easeOut}`,
    selectors: {
      '&:hover:not(:has(input:disabled))': {
        borderColor: vars.color.inputBorder,
      },
      '&:has(input:checked)': {
        borderColor: vars.color.accent,
        background: vars.color.selected,
      },
      '&:has(input:disabled)': {
        color: vars.color.subtle,
        cursor: 'not-allowed',
      },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  })
);

/** 가운데 점이 채워지는 원형 라디오다. */
export const radio = style(
  layered({
    appearance: 'none',
    flexShrink: 0,
    width: 20,
    height: 20,
    margin: '3px 0 0',
    border: `1.5px solid ${vars.color.inputBorder}`,
    borderRadius: '50%',
    background: vars.color.surface,
    cursor: 'inherit',
    selectors: {
      '&:checked': {
        borderColor: vars.color.accent,
        boxShadow: `inset 0 0 0 4px ${vars.color.surface}`,
        background: vars.color.accent,
      },
      '&:disabled': { borderColor: vars.color.lineStrong },
    },
  })
);

/** 선택지 문구와 보조 설명 묶음이다. */
export const text = style(
  layered({ display: 'grid', gap: vars.space.xxs, minWidth: 0 })
);

/** 선택지 아래 보조 설명이다. */
export const description = style(
  layered({
    color: vars.color.muted,
    fontSize: vars.fontSize.small,
    lineHeight: vars.lineHeight.small,
  })
);

/** 가로 타일 선택지는 남은 폭을 나눠 갖고 좁으면 다음 줄로 넘어간다. */
export const tile = style(
  layered({
    // 공통 칩 스타일과 불러오는 순서에 관계없이 이기도록 클래스를 두 번 겹친다.
    selectors: { '&&': { flex: '1 1 180px', minHeight: 60 } },
  })
);

/** 타일 안에서 화면에는 숨기고 키보드와 보조 기술에는 남기는 라디오다. */
export const hiddenRadio = style(
  layered({
    position: 'absolute',
    width: 1,
    height: 1,
    margin: 0,
    opacity: 0,
    pointerEvents: 'none',
  })
);

/** 타일 라벨 앞 아이콘 자리다. */
export const icon = style(
  layered({ display: 'inline-flex', flexShrink: 0, color: 'inherit' })
);
