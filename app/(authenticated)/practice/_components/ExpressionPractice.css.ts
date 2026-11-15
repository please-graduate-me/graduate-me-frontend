import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const reducedMotion = '(prefers-reduced-motion: reduce)';

const deal = keyframes({
  from: { opacity: 0, transform: 'translateX(28px) rotate(2deg)' },
  to: { opacity: 1, transform: 'none' },
});

const flip = keyframes({
  from: { opacity: 0, transform: 'perspective(900px) rotateX(-70deg)' },
  to: { opacity: 1, transform: 'none' },
});

const pop = keyframes({
  '0%': { opacity: 0, transform: 'scale(0.6)' },
  '60%': { opacity: 1, transform: 'scale(1.12)' },
  '100%': { transform: 'scale(1)' },
});

const ink = '#33363F';

/** 카드 영역을 넓게, 안내와 점검 현황을 옆 좁은 열에 둔다. */
export const layout = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: vars.space.xl,
});

/** 카드 묶음이나 완료 결과가 들어가는 넓은 열이다. */
export const main = style({
  flex: '999 1 560px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.comfortable,
});

/** 뒤에 겹친 카드 두 장이 보이도록 오른쪽 아래 여백을 둔다. */
export const deck = style({
  position: 'relative',
  padding: '0 14px 14px 0',
  '::before': {
    content: '""',
    position: 'absolute',
    inset: '14px 0 0 14px',
    border: `1px solid ${vars.color.line}`,
    borderRadius: 24,
    background: '#FAFAFB',
  },
  '::after': {
    content: '""',
    position: 'absolute',
    inset: 7,
    border: `1px solid ${vars.color.line}`,
    borderRadius: 24,
    background: vars.color.surface,
  },
});

/** 맨 위 카드이며 다음 카드로 넘어갈 때 옆에서 놓이듯 들어온다. */
export const card = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.comfortable,
  padding: 28,
  borderColor: vars.color.lineStrong,
  borderRadius: 24,
  boxShadow: vars.shadow.card,
  animation: `${deal} 420ms ${vars.motion.easeOut}`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});

/** 진행 번호, 안내, 보상 알림을 한 줄에 둔다. */
export const cardTop = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.sm,
});

/** 진행 번호는 숫자 글꼴로 표시한다. */
export const step = style({ fontFamily: vars.font.numeric });

/** 카드 안내 문구다. */
export const prompt = style({
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
});

/** 방금 받은 경험치를 튀어 오르듯 보여 준다. */
export const reward = style({
  marginLeft: 'auto',
  fontFamily: vars.font.numeric,
  animation: `${pop} 500ms ${vars.motion.spring}`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});

/** 떠올릴 표현을 카드 가운데 크게 둔다. */
export const expression = style({
  marginBlock: 8,
  textAlign: 'center',
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.heading1,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: '-0.01em',
  overflowWrap: 'anywhere',
});

/** 확인 버튼은 카드 가운데 넉넉한 폭으로 둔다. */
export const reveal = style({ alignSelf: 'center', minWidth: 240 });

/** 뒤집힌 카드 뒷면처럼 위에서 내려오며 열리는 확인 영역이다. */
export const back = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  padding: vars.space.comfortable,
  borderRadius: vars.radius.panel,
  background: vars.color.canvas,
  transformOrigin: 'top center',
  animation: `${flip} 500ms ${vars.motion.easeOut}`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});

/** 뒷면 소제목이다. */
export const backTitle = style({
  color: vars.color.muted,
  fontSize: vars.fontSize.label,
});

/** 저장한 뜻을 크게 읽게 한다. */
export const meaning = style({
  marginTop: -6,
  fontSize: vars.fontSize.lead,
  fontWeight: vars.fontWeight.bold,
  lineHeight: 1.5,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
});

/** 인용 아래 출처 줄이다. */
export const quoteSource = style({
  display: 'block',
  marginTop: vars.space.xs,
  color: vars.color.muted,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.bold,
});

/** 원문 링크의 누를 수 있는 높이를 확보한다. */
export const sourceLink = style({
  alignSelf: 'flex-start',
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 44,
  fontSize: vars.fontSize.small,
});

/** 결과 선택 안내다. */
export const choose = style({
  color: ink,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
});

/** 두 결과 버튼을 같은 폭으로 나란히 둔다. */
export const results = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: vars.space.sm,
});

/** 결과 버튼은 칸을 가득 채운다. */
export const result = style({ width: '100%', paddingInline: 12 });

/** 완료 결과 카드다. */
export const done = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
  padding: 28,
  borderRadius: 24,
  animation: `${deal} 420ms ${vars.motion.easeOut}`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});

/** 완료 도장과 제목을 나란히 둔다. */
export const doneTop = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 18,
});

/** 완료 표지는 청록 면 위 흰 알약으로 띄운다. */
export const doneBadge = style({ background: vars.color.surface });

/** 완료 제목은 짙은 청록으로 둔다. */
export const doneTitle = style({
  marginTop: 8,
  color: vars.color.accentPressed,
  fontSize: vars.fontSize.heading2,
});

/** 기억 결과 두 칸을 나란히 둔다. */
export const stats = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: vars.space.compact,
  margin: 0,
});

/** 결과 한 칸이며 놓인 면에 따라 흰색이나 회색 바탕을 쓴다. */
export const stat = style({
  padding: vars.space.md,
  borderRadius: 14,
  background: vars.color.surface,
  selectors: { '&[data-surface="muted"]': { background: vars.color.canvas } },
});

/** 결과 이름이다. */
export const statLabel = style({
  color: ink,
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
});

/** 결과 수는 숫자 글꼴로 크게 표시한다. */
export const statValue = style({
  margin: '4px 0 0',
  fontFamily: vars.font.numeric,
  fontSize: 26,
  fontWeight: vars.fontWeight.bold,
  selectors: {
    '&[data-tone="known"]': { color: vars.color.accentPressed },
    '&[data-tone="again"]': { color: vars.color.warning },
    '&[data-size="small"]': { fontSize: 22 },
  },
});

/** 다음 덱에 남은 표현 수 안내다. */
export const nextDeck = style({
  margin: 0,
  color: vars.color.ink,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
});

/** 완료 후 이동 동작을 한 줄에 감싼다. */
export const links = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
});

/** 안내와 점검 현황 열이다. */
export const aside = style({
  flex: '1 1 280px',
  maxWidth: 340,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  '@media': { '(max-width: 960px)': { maxWidth: 'none' } },
});

/** 안내 카드 안 요소를 세로로 쌓는다. */
export const guide = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.compact,
});

/** 안내 카드 표지는 내용 폭만 차지한다. */
export const guideBadge = style({ alignSelf: 'flex-start' });

/** 점검 현황 제목이다. */
export const summaryTitle = style({
  marginBottom: 14,
  fontSize: vars.fontSize.body,
});

/** 점검 현황 아래 설명이다. */
export const summaryNote = style({
  marginTop: vars.space.compact,
  fontSize: vars.fontSize.label,
  lineHeight: 1.55,
});
