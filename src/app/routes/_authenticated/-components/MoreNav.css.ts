import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const band = '#FAFAFB';

/** 상단 막대 바로 아래에 붙는 옅은 띠이며 본문 폭을 넘어 화면 끝까지 바탕을 칠한다. */
export const root = style({
  position: 'relative',
  // 공통 틀의 본문 위 여백을 상쇄해 상단 막대에 붙인다.
  marginTop: -32,
  marginBottom: vars.space.xl,
  paddingBlock: vars.space.xs,
  // 가로 스크롤을 만들지 않도록 레이아웃 밖으로만 그려지는 테두리 이미지로 띠와 아래 선을 화면 끝까지 늘린다.
  borderImage: `linear-gradient(${band} calc(100% - 1px), ${vars.color.line} 0) fill 0 / 0 / 0 100vmax`,
  '@media': {
    '(max-width: 800px)': { marginTop: -20, marginBottom: vars.space.lg },
  },
});

/** 이동 링크를 한 줄에 나열하고 좁은 화면에서는 가로로 넘긴다. */
export const list = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xxs,
  margin: 0,
  padding: 0,
  listStyle: 'none',
  '@media': {
    '(max-width: 640px)': {
      flexWrap: 'nowrap',
      overflowX: 'auto',
      scrollbarWidth: 'none',
    },
  },
});

/** 더보기 목적지 하나를 알약 모양 링크로 표시하고 현재 화면은 먹색으로 채운다. */
export const link = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  flexShrink: 0,
  minHeight: 44,
  padding: '0 14px',
  borderRadius: vars.radius.pill,
  color: '#33363F',
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  transition: `background-color ${vars.motion.fast} ${vars.motion.easeOut}`,
  selectors: {
    '&:hover': {
      background: '#EEF0F2',
      color: vars.color.ink,
      textDecoration: 'none',
    },
    '&[aria-current="page"], &[aria-current="page"]:hover': {
      background: vars.color.ink,
      color: vars.color.onAccent,
    },
    '&:focus-visible': { outlineOffset: -2 },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
});
