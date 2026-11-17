import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 선택한 저장 문제의 풀이 카드 안 요소를 세로로 쌓는다. */
export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  padding: vars.space.lg,
  borderRadius: vars.radius.tray,
});

/** 문제 종류, 출제 모델, 검토 상태 표지를 한 줄에 둔다. */
export const badges = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
});

/** 출제 정보와 답안 저장 상태처럼 작은 보조 글자다. */
export const meta = style({
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.bold,
});

/** 검토 상태는 줄 오른쪽 끝에 둔다. */
export const review = style({ marginLeft: 'auto' });

/** 문제 문장이다. */
export const question = style({
  fontSize: 20,
  lineHeight: 1.45,
  overflowWrap: 'anywhere',
});

/** 답안 입력, 저장 상태, 제출 동작을 쌓는다. */
export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.compact,
});

/** 제출과 도움 동작을 한 줄에 둔다. */
export const row = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
});

/** 결과와 설명 본문이다. */
export const prose = style({
  fontSize: vars.fontSize.small,
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
});

/** 정답 열람 내용은 회색 면에 담는다. */
export const revealed = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  padding: 18,
  borderRadius: 16,
  background: vars.color.canvas,
});

/** 정답 열람 제목이다. */
export const revealedTitle = style({ fontSize: vars.fontSize.small });

/** 채점 결과 면이며 정답, 오답, 자유답변 피드백마다 바탕색을 바꾼다. */
export const result = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  padding: 18,
  borderRadius: 16,
  background: vars.color.reviewBackground,
  selectors: {
    '&[data-tone="correct"]': { background: vars.color.selected },
    '&[data-tone="wrong"]': { background: vars.color.notice },
  },
});

/** 결과 표지는 색 면 위에서 흰 알약으로 띄운다. */
export const resultBadge = style({
  alignSelf: 'flex-start',
  background: vars.color.surface,
});

/** 도움 사용과 버전 기록이다. */
export const resultMeta = style({
  color: vars.color.accentPressed,
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.bold,
});

/** 다시 풀기 버튼은 내용 폭만 차지한다. */
export const retry = style({ alignSelf: 'flex-start' });

/** 듣기 연습은 실제 원문 영상의 지정 구절을 문제 안에서 재생한다. */
export const audio = style({
  width: '100%',
  maxWidth: 640,
  aspectRatio: '16 / 9',
  border: 0,
  borderRadius: vars.radius.control,
  background: vars.color.video,
});

/** 출제 근거 원문과 이동 링크를 묶는다. */
export const source = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

/** 출제 근거 이름표다. */
export const caption = style({
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.heavy,
});

/** 원문 링크의 누를 수 있는 높이를 확보한다. */
export const sourceLink = style({
  alignSelf: 'flex-start',
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 44,
  fontSize: vars.fontSize.small,
});

/** 신고와 복습 제외 동작을 구분선 아래 둔다. */
export const tools = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xxs,
  paddingTop: 8,
  borderTop: `1px solid ${vars.color.line}`,
});

/** 과거 제출 기록을 구분선 아래 둔다. */
export const attempts = style({
  paddingTop: 8,
  borderTop: `1px solid ${vars.color.line}`,
});
