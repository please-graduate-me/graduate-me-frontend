import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const reducedMotion = '(prefers-reduced-motion: reduce)';

const rise = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'none' },
});

/** 썸네일과 본문을 세로로 쌓은 추천 타일이며 가리키면 살짝 떠오른다. */
export const root = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: 0,
  borderRadius: vars.radius.card,
  overflow: 'hidden',
  animation: `${rise} ${vars.motion.slow} ${vars.motion.easeOut} both`,
  transition: [
    `transform ${vars.motion.base} ${vars.motion.easeOut}`,
    `box-shadow ${vars.motion.base} ${vars.motion.easeOut}`,
    `border-color ${vars.motion.base} ${vars.motion.easeOut}`,
  ].join(', '),
  selectors: {
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 10px 24px rgba(22, 24, 29, 0.08)',
      borderColor: '#C9CCD3',
    },
  },
  '@media': {
    [reducedMotion]: {
      animation: 'none',
      transition: 'none',
      selectors: { '&:hover': { transform: 'none' } },
    },
  },
});

/** 영상 썸네일 자리이며 이미지가 없으면 순번별 색 면과 장식을 보여 준다. */
export const thumb = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 150,
  overflow: 'hidden',
  background: vars.color.ink,
  selectors: {
    '&[data-tone="1"]': { background: vars.color.info },
    '&[data-tone="2"]': { background: vars.color.review },
    '&[data-tone="3"]': { background: vars.color.accent },
  },
});

/** 색 면 위 왼쪽 위의 가로 줄 장식이다. */
export const stripe = style({
  position: 'absolute',
  left: 16,
  top: 16,
  width: 64,
  height: 8,
  borderRadius: 4,
  background: 'rgba(255, 255, 255, 0.35)',
  selectors: {
    '& + &': { top: 30, width: 40, background: 'rgba(255, 255, 255, 0.22)' },
  },
});

/** 색 면 오른쪽 아래의 둥근 장식이다. */
export const bubble = style({
  position: 'absolute',
  right: -20,
  bottom: -30,
  width: 120,
  height: 120,
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.12)',
});

/** 실제 영상 썸네일은 색 면 전체를 덮는다. */
export const image = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

/** 가운데 재생 표시이며 타일을 가리키면 튀어 오르듯 커진다. */
export const play = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 56,
  height: 56,
  paddingLeft: 4,
  boxSizing: 'border-box',
  borderRadius: '50%',
  background: vars.color.surface,
  color: vars.color.ink,
  transition: `transform 250ms ${vars.motion.spring}`,
  selectors: { [`${root}:hover &`]: { transform: 'scale(1.08)' } },
  '@media': { [reducedMotion]: { transition: 'none' } },
});

/** 영상 길이 표시다. */
export const clock = style({
  position: 'absolute',
  right: 12,
  bottom: 12,
  padding: '3px 8px',
  borderRadius: 6,
  background: 'rgba(22, 24, 29, 0.82)',
  color: vars.color.onAccent,
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.bold,
});

/** 제목, 정보, 추천 이유, 동작을 세로로 쌓는다. */
export const body = style({
  flex: '1 1 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  padding: 18,
});

/** 영상 제목이다. */
export const title = style({
  fontSize: 17,
  lineHeight: 1.4,
  overflowWrap: 'anywhere',
});

/** 언어 표지와 길이·주제·난이도를 한 줄에 둔다. */
export const meta = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
});

/** 길이·주제·난이도 글자다. */
export const metaText = style({
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.bold,
});

/** 추천 이유를 회색 면에 담는다. */
export const reason = style({
  padding: '10px 12px',
  borderRadius: vars.radius.control,
  background: vars.color.canvas,
  color: '#33363F',
  fontSize: vars.fontSize.label,
  lineHeight: 1.6,
});

/** 추천 이유 이름표다. */
export const reasonLabel = style({ color: vars.color.ink });

/** 학습 시작과 관심 없음을 카드 아래에 붙인다. */
export const actions = style({
  marginTop: 'auto',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.xs,
  paddingTop: vars.space.xxs,
});

/** 학습 시작은 남은 폭을 채운다. */
export const start = style({ flex: '1 1 auto' });
