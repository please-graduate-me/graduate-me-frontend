import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const reducedMotion = '(prefers-reduced-motion: reduce)';

const slide = keyframes({
  from: { opacity: 0, transform: 'translateX(12px)' },
  to: { opacity: 1, transform: 'none' },
});

/** 목록 옆에 붙어 따라오는 상세 열이며 표현을 바꿀 때 옆에서 미끄러져 들어온다. */
export const detail = style({
  flex: '1.15 1 420px',
  minWidth: 0,
  position: 'sticky',
  top: vars.space.lg,
  '@media': { '(max-width: 900px)': { position: 'static' } },
});

/** 상세 카드 안 요소를 세로로 쌓는다. */
export const pane = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  padding: vars.space.lg,
  borderRadius: 24,
  animation: `${slide} 280ms ${vars.motion.easeOut}`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});

/** 언어 표지와 편집 동작을 양 끝에 둔다. */
export const top = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.xs,
});

/** 표현 자체를 숫자 글꼴 계열의 큰 제목으로 표시한다. */
export const title = style({
  fontFamily: vars.font.numeric,
  fontSize: 28,
  fontWeight: vars.fontWeight.bold,
  lineHeight: 1.3,
  overflowWrap: 'anywhere',
});

/** 종류, 복습 상태, 버전 정보다. */
export const meta = style({
  marginTop: vars.space.xs,
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
});

/** 정리한 뜻이다. */
export const meaning = style({
  color: '#33363F',
  fontSize: vars.fontSize.body,
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
});

/** 아직 적지 않은 뜻이나 메모의 안내는 기울여 구분한다. */
export const empty = style({
  color: vars.color.subtle,
  fontStyle: 'italic',
});

/** 처음 만난 문맥의 이름, 인용, 원문 링크를 묶는다. */
export const context = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

/** 묶음 위의 작은 이름표다. */
export const caption = style({
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.heavy,
});

/** 원문 링크의 누를 수 있는 높이를 확보한다. */
export const sourceLink = style({
  alignSelf: 'flex-start',
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  minHeight: 44,
  fontSize: vars.fontSize.small,
});

/** 편집 양식과 메모 보기를 회색 면에 담는다. */
export const tray = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  padding: vars.space.md,
  borderRadius: 16,
  background: vars.color.canvas,
  animation: `${slide} 280ms ${vars.motion.easeOut}`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});

/** 메모 보기는 편집 양식보다 촘촘하게 둔다. */
export const note = style({ gap: vars.space.xs, padding: '14px 16px' });

/** 메모 본문이다. */
export const noteText = style({
  color: '#33363F',
  fontSize: vars.fontSize.small,
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
});

/** 저장 종류 선택지의 이름과 칩 묶음이다. */
export const kindField = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

/** 저장 종류 이름표다. */
export const kindLabel = style({
  color: '#33363F',
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.heavy,
});

/** 저장 종류 칩을 감싼다. */
export const kindOptions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xs,
});

/** 저장 버튼은 내용 폭만 차지한다. */
export const submit = style({ alignSelf: 'flex-start' });

/** 복습과 삭제 동작을 구분선 아래 한 줄에 둔다. */
export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
  paddingTop: vars.space.md,
  borderTop: `1px solid ${vars.color.line}`,
});

/** 삭제는 다른 동작과 떨어진 오른쪽 끝에 위험 색으로 둔다. */
export const remove = style({
  marginLeft: 'auto',
  // 투명 버튼의 주변 글자색 상속보다 확실히 앞서도록 선택자를 한 번 더 겹친다.
  selectors: { '&&': { color: vars.color.error } },
});
