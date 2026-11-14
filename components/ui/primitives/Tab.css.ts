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
