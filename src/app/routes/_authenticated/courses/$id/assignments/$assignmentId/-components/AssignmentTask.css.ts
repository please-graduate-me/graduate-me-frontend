import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const enter = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'none' },
});

/** 지금 푸는 구절 하나를 세로로 쌓고 바뀔 때 아래에서 떠오르게 한다. */
export const task = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
  minWidth: 0,
  animation: `${enter} 280ms ${vars.motion.easeOut}`,
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
});

/** 구절 번호와 구간은 숫자 글꼴의 보조색 소제목으로 둔다. */
export const heading = style({
  margin: 0,
  fontFamily: vars.font.numeric,
  fontSize: 15,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.muted,
});

/** 원본 영상과 구간 막대를 어두운 판 하나로 묶는다. */
export const playerBox = style({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: vars.radius.card,
  overflow: 'hidden',
  background: vars.color.ink,
});

/** 원본 음성을 답안과 같은 과제 영역에서 재생한다. */
export const player = style({
  display: 'block',
  width: '100%',
  aspectRatio: '16 / 9',
  border: 0,
  background: vars.color.video,
});

/** 구절의 시작·끝 시각과 구간 막대를 플레이어 아래 한 줄에 둔다. */
export const range = style({
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.compact,
  padding: '12px 18px 14px',
  color: vars.color.lineStrong,
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.bold,
  fontVariantNumeric: 'tabular-nums',
});

/** 과제 전체 구간을 나타내는 어두운 막대다. */
export const track = style({
  position: 'relative',
  flex: '1 1 auto',
  height: 4,
  borderRadius: 2,
  // 어두운 판 위에서만 쓰는 막대 바탕이라 공통 토큰 대신 이 파일에 둔다.
  background: '#3A3F4A',
});

/** 지금 구절이 차지하는 구간을 밝은 청록으로 강조한다. */
export const segment = style({
  position: 'absolute',
  top: -2,
  height: 8,
  borderRadius: 4,
  background: vars.color.accentBright,
});

/** 힌트 버튼의 전구는 따뜻한 주황으로 눈에 띄게 한다. */
export const hintIcon = style({ color: vars.color.streakBright });

/** 듣기와 힌트 동작을 한 줄에 흘린다. */
export const actions = style({ display: 'flex', flexWrap: 'wrap', gap: 8 });

/** 받은 힌트는 따뜻한 바탕의 작은 상자로 답안 위에 둔다. */
export const hint = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.compact,
  padding: '12px 16px',
  borderRadius: 14,
  border: `1px solid ${vars.color.quoteLine}`,
  background: vars.color.quote,
  animation: `${enter} 400ms ${vars.motion.easeOut}`,
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
});

/** 힌트 상자의 머리글이다. */
export const hintLabel = style({
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.heavy,
  color: vars.color.warning,
});

/** 힌트 본문은 숫자 글꼴로 크게 보여 준다. */
export const hintText = style({
  fontFamily: vars.font.numeric,
  fontSize: 17,
  fontWeight: vars.fontWeight.bold,
  overflowWrap: 'anywhere',
});

/** 빈칸 문장은 큰 글자의 인라인 글줄로 흘려 긴 문장도 줄 리듬을 유지한다. */
export const sentence = style({
  margin: '8px 0 0',
  fontFamily: vars.font.numeric,
  fontSize: 28,
  fontWeight: vars.fontWeight.bold,
  lineHeight: 2.1,
  letterSpacing: '-0.01em',
  overflowWrap: 'anywhere',
  '@media': { '(max-width: 560px)': { fontSize: 22 } },
});

/** 단어 뒤에 빈칸과 같은 간격을 둔다. */
export const word = style({ marginRight: '0.3em' });

/** 빈칸은 문장보다 조금 작은 글자로 넣고 좁은 화면을 넘지 않게 한다. */
export const blank = style({ maxWidth: '100%', fontSize: '0.93em' });

/** 읽기 과제 원문은 문서 서체 인용으로 답안 입력과 구분한다. */
export const quote = style({
  margin: 0,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
});

/** 원본 PDF 링크가 행 전체로 늘어나지 않게 한다. */
export const source = style({ alignSelf: 'flex-start' });
