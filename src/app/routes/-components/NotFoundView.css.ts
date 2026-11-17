import {
  createVar,
  keyframes,
  style,
  styleVariants,
} from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const tilt = createVar();

const float = keyframes({
  '0%, 100%': { transform: `translateY(0) rotate(${tilt})` },
  '50%': { transform: `translateY(-10px) rotate(${tilt})` },
});

const rising = keyframes({
  from: { opacity: 0, transform: 'translateY(20px)' },
  to: { opacity: 1, transform: 'none' },
});

const reducedMotion = '(prefers-reduced-motion: reduce)';

/** 도장 그림과 안내를 가운데에 쌓고 떠다니는 단어가 넘치지 않게 자른다. */
export const root = style({
  position: 'relative',
  maxWidth: 1120,
  margin: '0 auto',
  padding: '72px 24px 96px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  overflow: 'hidden',
  '@media': { '(max-width: 760px)': { padding: '48px 16px 72px' } },
});

/** 화면 가장자리에 떠다니는 영어 단어 카드이며 좁은 화면에서는 숨긴다. */
export const word = style({
  position: 'absolute',
  padding: '10px 16px',
  borderRadius: 14,
  borderStyle: 'solid',
  borderWidth: '1.5px 1.5px 4px',
  fontFamily: vars.font.numeric,
  fontSize: 17,
  fontWeight: vars.fontWeight.bold,
  animation: `${float} 5s ease-in-out infinite`,
  '@media': {
    '(max-width: 760px)': { display: 'none' },
    [reducedMotion]: { animation: 'none', transform: `rotate(${tilt})` },
  },
});

/** 단어 카드마다 위치, 기울기, 색과 떠오르는 박자를 다르게 준다. */
export const wordTone = styleVariants({
  plain: {
    vars: { [tilt]: '-6deg' },
    left: '8%',
    top: 120,
    background: vars.color.surface,
    borderColor: vars.color.lineStrong,
    color: vars.color.ink,
  },
  teal: {
    vars: { [tilt]: '5deg' },
    right: '9%',
    top: 150,
    background: vars.color.selected,
    borderColor: vars.color.accentBright,
    color: vars.color.accent,
    animationDuration: '6s',
    animationDelay: '-2s',
  },
  warm: {
    vars: { [tilt]: '-3deg' },
    right: '10%',
    bottom: 72,
    background: vars.color.notice,
    borderColor: '#F3B97A',
    color: vars.color.warning,
    animationDuration: '5.5s',
    animationDelay: '-1s',
  },
});

/** 빈 문서 위에 404 도장이 찍힌 그림 영역이다. */
export const art = style({ position: 'relative', width: 260, height: 250 });

/** 내용이 사라진 점선 문서다. */
export const sheet = style({
  position: 'absolute',
  left: 30,
  top: 10,
  width: 170,
  height: 220,
  padding: '26px 20px',
  border: '2px dashed #C9CCD3',
  borderRadius: 16,
  background: '#FAFAFB',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.compact,
});

/** 문서의 흐린 본문 줄이다. */
export const bar = style({
  height: 6,
  borderRadius: 3,
  background: vars.color.neutral,
  selectors: {
    '&:nth-child(3)': { width: '85%' },
    '&:nth-child(4)': { width: '60%' },
  },
});

/** 문서의 흐린 제목 줄이다. */
export const barTitle = style({
  height: 8,
  width: '70%',
  borderRadius: 4,
  background: vars.color.line,
});

/** 도장을 문서 오른쪽 아래에 겹쳐 찍는다. */
export const stamp = style({
  position: 'absolute',
  right: 0,
  bottom: 0,
  display: 'flex',
});

/** 오류 번호를 제목 위의 작은 영문 표지로 둔다. */
export const code = style({
  margin: '28px 0 0',
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: '0.12em',
  color: vars.color.accent,
});

/** 제목 위 여백이다. */
export const title = style({ marginTop: vars.space.sm });

/** 설명이 너무 길게 퍼지지 않게 폭을 제한한다. */
export const description = style({
  maxWidth: 580,
  marginTop: vars.space.md,
  lineHeight: 1.7,
});

/** 복귀 버튼 묶음을 안내 아래에 둔다. */
export const actions = style({ marginTop: vars.space.xl });

/** 복귀 버튼을 넉넉한 폭으로 둔다. */
export const action = style({ minWidth: 220 });

/** 제목이 아래에서 떠오르며 나타난다. */
export const rise = style({
  animation: `${rising} 700ms ${vars.motion.easeOut} both`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});

/** 설명과 행동은 제목보다 한 박자 늦게 떠오른다. */
export const riseLate = style({
  animation: `${rising} 700ms ${vars.motion.easeOut} 120ms both`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});
