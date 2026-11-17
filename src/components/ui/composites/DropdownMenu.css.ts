import { keyframes, style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

const open = keyframes({
  from: { opacity: 0, transform: 'translateY(-4px) scale(0.98)' },
  to: { opacity: 1, transform: 'none' },
});

/** 흰 바탕과 떠 있는 그림자의 메뉴 면이다. */
export const content = style(
  layered({
    zIndex: 1000,
    minWidth: 200,
    maxWidth: 'min(320px, calc(100vw - 16px))',
    maxHeight: 'var(--radix-dropdown-menu-content-available-height)',
    padding: vars.space.xxs,
    border: `1px solid ${vars.color.line}`,
    borderRadius: vars.radius.control,
    background: vars.color.surface,
    boxShadow: vars.shadow.popover,
    overflowY: 'auto',
    transformOrigin: 'var(--radix-dropdown-menu-content-transform-origin)',
    animation: `${open} ${vars.motion.fast} ${vars.motion.easeOut}`,
    '@media': {
      '(prefers-reduced-motion: reduce)': { animation: 'none' },
    },
  })
);

/** 메뉴 한 줄이며 키보드나 포인터로 가리키면 회색 바탕이 된다. */
export const item = style(
  layered({
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.sm,
    minHeight: 44,
    padding: `0 ${vars.space.compact}`,
    borderRadius: vars.radius.small,
    color: vars.color.ink,
    fontSize: vars.fontSize.small,
    fontWeight: vars.fontWeight.bold,
    lineHeight: vars.lineHeight.small,
    textDecoration: 'none',
    cursor: 'pointer',
    outline: 'none',
    userSelect: 'none',
    selectors: {
      '&[data-highlighted]': { background: vars.color.canvas },
      '&[data-disabled]': { color: vars.color.subtle, cursor: 'not-allowed' },
    },
  })
);

/** 위험한 동작은 빨간 글자로 구분한다. */
export const danger = style(layered({ color: vars.color.error }));

/** 항목 앞 아이콘 자리다. */
export const icon = style(
  layered({ display: 'inline-flex', flexShrink: 0, color: vars.color.muted })
);

/** 버튼형 기본 트리거의 펼침 화살표다. */
export const chevron = style(layered({ marginRight: -4 }));
