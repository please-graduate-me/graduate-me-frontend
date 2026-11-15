import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 선택되면 먹색 2px 밑줄이 생기는 탭이며 전역 글자 초기화를 이기도록 글자 속성만 계층 밖에 둔다. */
export const tab = style({
  color: vars.color.muted,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
  lineHeight: 1.2,
  selectors: {
    '&:hover': { color: vars.color.ink },
    '&[aria-selected="true"], &[aria-current="true"]': {
      color: vars.color.ink,
    },
    // 가로 스크롤 영역에 잘리지 않도록 초점 외곽선을 안쪽에 그린다.
    '&:focus-visible': { outlineOffset: -2 },
  },
  ...layered({
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space.xs,
    flexShrink: 0,
    minHeight: 44,
    margin: 0,
    padding: `0 ${vars.space.compact}`,
    border: 0,
    borderBottom: '2px solid transparent',
    background: 'transparent',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: `color ${vars.motion.fast} ${vars.motion.easeOut}, border-color ${vars.motion.fast} ${vars.motion.easeOut}`,
    selectors: {
      '&[aria-selected="true"], &[aria-current="true"]': {
        borderBottomColor: vars.color.ink,
      },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  }),
});

/** 알약 탭은 하위 메뉴처럼 쓰며 선택되면 먹색 바탕 흰 글자로 바뀐다. */
export const pill = style({
  selectors: {
    '&[aria-selected="true"], &[aria-current="true"]': {
      color: vars.color.onAccent,
    },
  },
  ...layered({
    padding: `0 14px`,
    borderBottom: 0,
    borderRadius: vars.radius.pill,
    transition: `color ${vars.motion.fast} ${vars.motion.easeOut}, background-color ${vars.motion.fast} ${vars.motion.easeOut}`,
    selectors: {
      '&:hover': { background: vars.color.canvasHover },
      '&[aria-selected="true"], &[aria-current="true"]': {
        background: vars.color.ink,
      },
      '&[aria-selected="true"]:hover, &[aria-current="true"]:hover': {
        background: vars.color.ink,
      },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  }),
});
