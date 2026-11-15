import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 뒷장 두 장이 비치도록 오른쪽 아래에 여백을 남긴 카드 묶음이다. */
export const stack = style({
  position: 'relative',
  maxWidth: 640,
  padding: '0 14px 14px 0',
});

/** 가장 뒤의 카드로, 회색 바탕이 오른쪽 아래로 14px 비친다. */
export const backCard = style({
  position: 'absolute',
  inset: '14px 0 0 14px',
  border: `1px solid ${vars.color.line}`,
  borderRadius: 24,
  background: vars.color.surfaceHover,
});

/** 가운데 카드로, 앞 카드와 뒷장 사이 7px 간격을 만든다. */
export const middleCard = style({
  position: 'absolute',
  inset: 7,
  border: `1px solid ${vars.color.line}`,
  borderRadius: 24,
  background: vars.color.surface,
});

/** 앞 카드에 제목, 그림, 진행률, 주 행동을 세로로 쌓는다. */
export const card = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.comfortable,
  padding: 28,
  border: `1px solid ${vars.color.lineStrong}`,
  borderRadius: 24,
  background: vars.color.surface,
  boxShadow: vars.shadow.card,
  '@media': { '(max-width: 640px)': { padding: vars.space.comfortable } },
});

/** 알약, 제목, 진행 문구를 가운데 정렬한다. */
export const header = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.sm,
  textAlign: 'center',
});

/** 시안의 24px 카드 제목 크기를 유지한다. */
export const title = style({
  fontSize: vars.fontSize.heading2,
  letterSpacing: '-0.01em',
  overflowWrap: 'anywhere',
});

/** 자료 종류와 진도를 제목 아래 작은 굵은 글자로 둔다. */
export const meta = style({ fontSize: vars.fontSize.label });

/** 떠다니는 장식 그림이 들어갈 200px 높이 자리다. */
export const illustration = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 200,
  '@media': { '(max-width: 480px)': { height: 160 } },
});

/** 다음 단계 묶음을 옅은 회색 줄에 아이콘, 문구, 예상 XP 순으로 둔다. */
export const nextStep = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.compact,
  padding: '12px 14px',
  borderRadius: 16,
  background: vars.color.canvas,
});

/** 재생 표지는 밝은 청록 원 안에 흰 아이콘으로 둔다. */
export const nextIcon = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: 36,
  height: 36,
  borderRadius: '50%',
  background: vars.color.accentBright,
  color: vars.color.onAccent,
});

/** 문구가 예상 XP를 밀지 않게 남은 폭을 쓴다. */
export const nextBody = style({ flex: '1 1 auto', minWidth: 0 });

/** "다음 단계" 이름은 12px로 낮춘다. */
export const nextLabel = style({ fontSize: vars.fontSize.caption });

/** 묶음 이름은 15px 굵은 글자다. */
export const nextTitle = style({
  marginTop: 2,
  fontSize: 15,
  fontWeight: vars.fontWeight.heavy,
});

/** 예상 XP는 청록 숫자 서체로 오른쪽 끝에 둔다. */
export const nextXp = style({
  flexShrink: 0,
  fontSize: vars.fontSize.label,
  color: vars.color.accent,
});

/** 주 행동은 카드 폭 전체를 채운다. */
export const action = style({ width: '100%' });
