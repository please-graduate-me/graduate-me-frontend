import { keyframes, style, styleVariants } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

const enter = keyframes({
  from: { opacity: 0, transform: 'translateY(16px)' },
  to: { opacity: 1, transform: 'none' },
});

const leave = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0, transform: 'translateX(var(--radix-toast-swipe-end-x))' },
});

/** 알림 목록이며 화면 위치는 사용하는 쪽이 감싸는 요소로 정한다. */
export const viewport = style(
  layered({
    display: 'grid',
    gap: vars.space.sm,
    margin: 0,
    padding: 0,
    listStyle: 'none',
    outline: 'none',
  })
);

/** 흰 카드 모양 알림이며 옆으로 밀어 닫을 수 있다. */
export const toast = style(
  layered({
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.compact,
    padding: vars.space.md,
    border: `1px solid ${vars.color.line}`,
    borderRadius: vars.radius.panel,
    background: vars.color.surface,
    color: vars.color.ink,
    boxShadow: vars.shadow.lift,
    animation: `${enter} ${vars.motion.slow} ${vars.motion.spring}`,
    selectors: {
      '&[data-swipe="move"]': {
        transform: 'translateX(var(--radix-toast-swipe-move-x))',
      },
      '&[data-swipe="cancel"]': {
        transform: 'none',
        transition: `transform ${vars.motion.base} ${vars.motion.easeOut}`,
      },
      '&[data-swipe="end"], &[data-state="closed"]': {
        animation: `${leave} ${vars.motion.base} ${vars.motion.easeOut} forwards`,
      },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        animation: 'none',
        selectors: {
          '&[data-swipe="end"], &[data-state="closed"]': { animation: 'none' },
        },
      },
    },
  })
);

/** 경고와 오류만 왼쪽 띠 색으로 구분하고 일반 알림은 흰 카드로 둔다. */
export const tone = styleVariants({
  info: {},
  success: {},
  warning: layered({ borderLeft: `4px solid ${vars.color.streakBright}` }),
  error: layered({ borderLeft: `4px solid ${vars.color.error}` }),
});

/** 알림 본문이다. */
export const body = style(layered({ flex: '1 1 auto', minWidth: 0 }));

/** 닫기 버튼 같은 끝 내용이다. */
export const end = style(layered({ flexShrink: 0, alignSelf: 'flex-start' }));
