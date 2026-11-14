import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 이름과 막대를 위아래로 쌓는다. */
export const root = style(
  layered({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space.xs,
    minWidth: 0,
  })
);

/** 보이는 진행 이름이다. */
export const label = style(
  layered({
    fontSize: vars.fontSize.label,
    fontWeight: vars.fontWeight.bold,
    color: vars.color.muted,
  })
);

/** 시안의 옅은 회색 알약 트랙이다. */
export const track = style(
  layered({
    height: vars.space.sm,
    borderRadius: vars.radius.pill,
    background: '#EEF0F2',
    overflow: 'hidden',
  })
);

/** 진행 비율만큼 청록으로 채우며 너비는 컴포넌트가 인라인으로 넘긴다. */
export const fill = style(
  layered({
    height: '100%',
    borderRadius: vars.radius.pill,
    background: vars.color.accent,
    transition: `width ${vars.motion.slow} ${vars.motion.easeOut}`,
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  })
);
