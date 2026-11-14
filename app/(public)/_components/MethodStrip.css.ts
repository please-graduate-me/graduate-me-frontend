import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 학습 방식을 얇은 띠 하나에 가운데 정렬로 나열한다. */
export const root = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '12px 40px',
  margin: 0,
  padding: '18px 24px',
  listStyle: 'none',
  borderTop: '1px solid ' + vars.color.line,
  borderBottom: '1px solid ' + vars.color.line,
  '@media': {
    '(max-width: 800px)': { gap: '10px 24px', padding: '16px 0' },
  },
});

/** 도형과 이름을 한 줄에 묶는다. */
export const item = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

const shape = style({ flex: 'none', width: 22, height: 22, borderRadius: 6 });

/** 학습 방식마다 색과 모양을 달리해 한눈에 구별하게 한다. */
export const shapes = styleVariants({
  pdf: [shape, { background: '#8B7CF6' }],
  video: [shape, { background: '#16181D' }],
  blank: [shape, { background: '#F97316', borderRadius: '50%' }],
  question: [shape, { background: '#12A47F', borderRadius: '6px 6px 6px 0' }],
  review: [shape, { background: '#1D4ED8' }],
});
