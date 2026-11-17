import { keyframes, style, styleVariants } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

const rise = keyframes({
  from: { transform: 'translateY(100%)' },
  to: { transform: 'none' },
});

/** 화면 아래에 붙어 아래에서 올라오는 채점 결과 시트다. */
export const root = style(
  layered({
    position: 'sticky',
    bottom: 0,
    zIndex: 10,
    padding: `18px ${vars.space.lg}`,
    animation: `${rise} ${vars.motion.slow} ${vars.motion.easeOut}`,
    '@media': {
      '(prefers-reduced-motion: reduce)': { animation: 'none' },
    },
  })
);

/** 정답은 청록, 다시 시도는 주황 바탕이다. */
export const tone = styleVariants(
  {
    success: { background: vars.color.selected },
    warning: { background: vars.color.notice },
  },
  layered
);

/** 그림, 문구, 버튼을 한 줄에 두고 좁으면 줄바꿈한다. */
export const inner = style(
  layered({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: vars.space.md,
    maxWidth: 1072,
    margin: '0 auto',
  })
);

/** 도장이나 상태 원을 담는 자리다. */
export const media = style(layered({ display: 'flex', flexShrink: 0 }));

/** 결과 제목과 보조 문구 묶음이다. */
export const text = style(
  layered({
    display: 'grid',
    gap: 2,
    flex: '1 1 200px',
    minWidth: 0,
  })
);

/** 결과 제목이다. */
export const title = style(
  layered({
    margin: 0,
    fontSize: vars.fontSize.lead,
    fontWeight: vars.fontWeight.heavy,
    lineHeight: vars.lineHeight.heading,
  })
);

/** 결과 아래 보조 문구다. */
export const description = style(
  layered({
    margin: 0,
    fontSize: vars.fontSize.small,
    lineHeight: vars.lineHeight.small,
  })
);

/** 상태별 진한 글자색이다. */
export const textTone = styleVariants(
  {
    success: { color: vars.color.accentPressed },
    warning: { color: vars.color.warningStrong },
  },
  layered
);

/** 보조·주 버튼 줄이다. */
export const actions = style(
  layered({
    display: 'flex',
    flexWrap: 'wrap',
    gap: vars.space.sm,
  })
);
