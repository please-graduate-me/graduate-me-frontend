import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 영상 포스터 위에 올리는 큰 청록 원형 재생 버튼이며 가리키면 탄성 있게 커진다. */
export const root = style(
  layered({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 84,
    height: 84,
    margin: 0,
    padding: 0,
    border: 0,
    borderRadius: '50%',
    background: vars.color.accentBright,
    color: vars.color.onAccent,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
    cursor: 'pointer',
    transition: `transform ${vars.motion.slow} ${vars.motion.spring}`,
    selectors: {
      '&:hover': { transform: 'scale(1.08)' },
      '&:focus-visible': {
        outline: `3px solid ${vars.color.onAccent}`,
        outlineOffset: 3,
      },
    },
    '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
  })
);
