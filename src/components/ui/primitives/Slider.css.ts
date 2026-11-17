import { createVar, style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 채워진 구간의 비율이다. */
export const fill = createVar();

const track = {
  height: 6,
  borderRadius: vars.radius.pill,
  background: `linear-gradient(to right, ${vars.color.accent} ${fill}, ${vars.color.line} ${fill})`,
};

const thumb = {
  width: 18,
  height: 18,
  border: `3px solid ${vars.color.accent}`,
  borderRadius: '50%',
  background: vars.color.surface,
  boxShadow: vars.shadow.card,
  cursor: 'pointer',
};

/** 진행 구간을 청록으로 채우는 네이티브 범위 입력이다. */
export const root = style(
  layered({
    vars: { [fill]: '0%' },
    appearance: 'none',
    display: 'block',
    width: '100%',
    height: 24,
    margin: 0,
    background: 'transparent',
    cursor: 'pointer',
    selectors: {
      '&::-webkit-slider-runnable-track': track,
      '&::-moz-range-track': track,
      '&::-webkit-slider-thumb': {
        ...thumb,
        appearance: 'none',
        marginTop: -6,
      },
      '&::-moz-range-thumb': thumb,
      '&:disabled': { opacity: 0.48, cursor: 'not-allowed' },
    },
  })
);
