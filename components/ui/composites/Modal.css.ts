import { createVar, globalStyle, keyframes, style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 대화상자의 최대 폭이다. */
export const width = createVar();

const enter = keyframes({
  from: { opacity: 0, transform: 'translateY(8px) scale(0.98)' },
  to: { opacity: 1, transform: 'none' },
});

const fade = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });

/** 흰 카드 모양의 네이티브 모달이며 내용이 길면 본문만 스크롤한다. */
export const dialog = style(
  layered({
    vars: { [width]: '640px' },
    width: `min(${width}, calc(100vw - 32px))`,
    maxWidth: 'none',
    maxHeight: 'calc(100dvh - 48px)',
    margin: 'auto',
    padding: 0,
    border: 0,
    borderRadius: vars.radius.card,
    background: vars.color.surface,
    color: vars.color.ink,
    boxShadow: vars.shadow.popover,
    overflow: 'hidden',
    selectors: {
      '&[open]': {
        display: 'flex',
        flexDirection: 'column',
        animation: `${enter} ${vars.motion.base} ${vars.motion.easeOut}`,
      },
      '&::backdrop': {
        background: vars.color.overlay,
        animation: `${fade} ${vars.motion.base} ${vars.motion.easeOut}`,
      },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        selectors: {
          '&[open]': { animation: 'none' },
          '&::backdrop': { animation: 'none' },
        },
      },
    },
  })
);

// 모달이 열린 동안 뒤 화면이 같이 스크롤되지 않게 한다.
globalStyle(`html:has(${dialog}[open])`, { overflow: 'hidden' });
