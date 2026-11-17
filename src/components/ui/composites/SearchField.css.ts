import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 돋보기, 입력, 제출 버튼을 담는 52px 회색 둥근 검색 막대다. */
export const root = style(
  layered({
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.sm,
    minWidth: 0,
    minHeight: 52,
    padding: `${vars.space.xxs} ${vars.space.md}`,
    borderRadius: '16px',
    background: vars.color.canvas,
    transition: `background-color ${vars.motion.fast} ${vars.motion.easeOut}`,
    selectors: {
      // 입력 자체 대신 막대 전체에 초점 고리를 그려 돋보기와 버튼까지 한 덩어리로 보이게 한다.
      '&:has(input:focus-visible)': {
        outline: `2px solid ${vars.color.focus}`,
        outlineOffset: 2,
      },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  })
);

/** 제출 버튼이 있으면 버튼이 막대 안쪽 4px에 붙도록 오른쪽 여백을 줄인다. */
export const withSubmit = style(layered({ paddingRight: vars.space.xxs }));

/** 입력 앞 돋보기다. */
export const icon = style(layered({ color: vars.color.muted }));

/** 막대 안의 테두리 없는 검색 입력이며 전역 글자 초기화를 이기도록 글자 속성만 계층 밖에 둔다. */
export const input = style({
  color: vars.color.ink,
  fontSize: '15px',
  fontWeight: vars.fontWeight.medium,
  selectors: {
    '&:focus-visible': { outline: 'none' },
  },
  ...layered({
    flex: '1 1 auto',
    minWidth: 0,
    height: 44,
    margin: 0,
    padding: 0,
    border: 0,
    background: 'transparent',
    fontFamily: 'inherit',
    selectors: {
      '&::placeholder': { color: vars.color.subtle, opacity: 1 },
    },
  }),
});
