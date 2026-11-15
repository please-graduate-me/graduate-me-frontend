import { keyframes, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const settle = keyframes({
  from: { opacity: 0, transform: 'translateY(16px)' },
  to: { opacity: 1, transform: 'none' },
});

/** 발췌 본문과 공유 범위 안내를 넓은 화면에서 두 열로 둔다. */
export const page = style({
  maxWidth: 1120,
  marginInline: 'auto',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: vars.space.xxl,
  minWidth: 0,
});

/** 발췌와 학습 진입 행동을 한 열로 쌓는다. */
export const article = style({
  flex: '999 1 560px',
  maxWidth: 720,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
});

/** 표지, 제목, 위치 정보를 왼쪽 정렬로 묶는다. */
export const heading = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: vars.space.sm,
  minWidth: 0,
});

/** 겹친 종이 뒤판이 보이도록 오른쪽과 아래에 자리를 남긴다. */
export const stack = style({
  position: 'relative',
  padding: '0 14px 14px 0',
  animation: `${settle} 500ms ${vars.motion.easeOut} both`,
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
});

const sheet = {
  position: 'absolute',
  border: `1px solid ${vars.color.quoteLine}`,
  borderRadius: 24,
} as const;

/** 가장 뒤에 깔린 종이 한 장이다. */
export const sheetBack = style({
  ...sheet,
  inset: '14px 0 0 14px',
  background: '#FFFCF7',
});

/** 발췌 바로 뒤의 종이 한 장이다. */
export const sheetMiddle = style({
  ...sheet,
  inset: 7,
  background: '#FFFAF2',
});

/** 공유된 발췌를 따뜻한 인용 종이로 크게 보여 준다. */
export const excerpt = style({
  position: 'relative',
  margin: 0,
  padding: '36px 32px',
  borderRadius: 24,
  border: '1px solid #F3D3AA',
  background: vars.color.quote,
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
  '@media': { '(max-width: 800px)': { padding: '24px 20px' } },
});

/** 인용 시작을 알리는 큰 따옴표 장식이다. */
export const mark = style({ fill: '#F3B97A' });

/** 발췌 본문을 문서 글꼴로 크게 읽게 한다. */
export const quote = style({
  margin: 0,
  fontFamily: vars.font.document,
  fontSize: 'clamp(20px, 3vw, 28px)',
  fontWeight: 600,
  lineHeight: 1.5,
  letterSpacing: '-0.01em',
  color: vars.color.documentInk,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
});

/** 자료 제목과 발췌 위치를 인용 아래에 둔다. */
export const caption = style({
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.heavy,
  color: vars.color.warning,
  overflowWrap: 'anywhere',
});

/** 위치 정보는 제목보다 낮은 위계로 둔다. */
export const captionMeta = style({
  fontWeight: vars.fontWeight.bold,
  color: vars.color.subtle,
});

/** 발췌만 공유된다는 안내를 아이콘과 한 줄에 둔다. */
export const note = style({
  display: 'flex',
  gap: vars.space.compact,
  padding: '16px 18px',
  lineHeight: 1.7,
});

/** 안내 아이콘을 첫 줄 높이에 맞춘다. */
export const noteIcon = style({ marginTop: 2 });

/** 안내 머리말을 본문보다 진하게 둔다. */
export const noteTitle = style({ color: vars.color.ink });

/** 원문 이동 조건과 행동을 한 카드에 묶는다. */
export const actions = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  padding: 22,
});

/** 주 행동과 보조 행동을 나란히 두고 좁으면 줄바꿈한다. */
export const buttons = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
});

/** 공유 범위 요약을 발췌 옆에 두되 좁은 화면에서는 아래로 내린다. */
export const aside = style({
  flex: '1 1 260px',
  maxWidth: 320,
  minWidth: 0,
  paddingTop: 112,
  '@media': {
    '(max-width: 1000px)': { maxWidth: 'none', paddingTop: 0 },
  },
});

/** 포함과 제외 목록을 한 카드에 쌓는다. */
export const scope = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
});

/** 범위 카드 제목 크기다. */
export const scopeTitle = style({ fontSize: 15 });

/** 범위 목록의 기본 들여쓰기를 없앤다. */
export const scopeList = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

/** 표시 원과 항목 이름을 한 줄에 둔다. */
export const scopeItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
});

/** 포함하지 않는 항목은 흐린 글자로 낮춘다. */
export const excluded = style({ color: vars.color.muted });

/** 포함 여부를 보여 주는 작은 원이다. */
export const scopeMark = style({
  width: 24,
  height: 24,
  flex: 'none',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

/** 포함은 청록, 제외는 회색으로 나눈다. */
export const markTone = styleVariants({
  in: { background: vars.color.selected, color: vars.color.accent },
  out: { background: vars.color.neutral, color: vars.color.subtle },
});

/** 포함과 제외 목록 사이 구분선이다. */
export const divider = style({
  width: '100%',
  height: 1,
  margin: 0,
  border: 0,
  background: vars.color.neutral,
});

/** 제외 목록 머리말이다. */
export const excludedTitle = style({
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.heavy,
  color: vars.color.muted,
});
