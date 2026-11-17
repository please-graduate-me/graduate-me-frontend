import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const reducedMotion = '(prefers-reduced-motion: reduce)';

const enter = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'none' },
});

const rise = keyframes({
  from: { transform: 'translateY(100%)' },
  to: { transform: 'none' },
});

/** 과제 풀이 화면 전체를 세로로 쌓고 아래 제출 막대가 끝에 붙게 한다. */
export const root = style({
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
});

/** 닫기, 진행 막대와 상태 확인을 한 줄에 두는 집중 화면 머리다. */
export const header = style({
  maxWidth: 1120,
  width: '100%',
  marginInline: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.comfortable,
  '@media': { '(max-width: 560px)': { gap: vars.space.sm } },
});

/** 닫기 링크를 정사각형 아이콘 버튼으로 둔다. */
export const close = style({ width: 44, padding: 0 });

/** 진행 막대가 닫기와 동작 사이 남은 폭을 차지한다. */
export const progress = style({ flex: '1 1 auto', minWidth: 0 });

/** 진행 막대가 없을 때 동작을 오른쪽 끝으로 민다. */
export const spacer = style({ flex: '1 1 auto' });

/** 머리 오른쪽 동작 묶음이다. */
export const headerActions = style({
  flex: '0 0 auto',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: 8,
});

/** 풀이 본문은 읽기 좋은 폭으로 가운데 둔다. */
export const main = style({
  flex: '1 1 auto',
  width: '100%',
  maxWidth: 760,
  marginInline: 'auto',
  padding: '36px 0 72px',
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
  minWidth: 0,
  '@media': { '(max-width: 560px)': { paddingTop: vars.space.lg } },
});

/** 풀이 방식 표지, 제목, 버전 정보와 제출 조건을 가까이 묶는다. */
export const intro = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

/** 풀이 방식 표지가 행 전체로 늘어나지 않게 한다. */
export const kind = style({ alignSelf: 'flex-start' });

/** 과제 제목은 집중 화면에 맞춰 조금 작게 둔다. */
export const title = style({ fontSize: 28, lineHeight: 1.35 });

/** 버전과 자료 이름은 굵은 보조 글자로 둔다. */
export const meta = style({
  margin: 0,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.muted,
});

/** 제출 조건을 알약으로 한 줄에 흘린다. */
export const conditions = style({
  listStyle: 'none',
  margin: '6px 0 0',
  padding: 0,
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
});

/** 제출 조건 하나의 회색 알약이다. */
export const condition = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  padding: '5px 12px',
  borderRadius: vars.radius.pill,
  background: vars.color.canvas,
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
});

/** 기한은 따뜻한 색 알약으로 다른 조건보다 먼저 읽히게 한다. */
export const due = style({
  background: vars.color.notice,
  color: vars.color.warning,
});

/** 새로 나타난 안내가 아래에서 떠오르게 한다. */
export const notice = style({
  animation: `${enter} 400ms ${vars.motion.easeOut}`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});

/** 답안 작성 영역 전체를 묶는다. */
export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
});

/** 이전·다음 구절과 번호 이동을 한 줄 양 끝과 가운데에 둔다. */
export const steps = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.compact,
  paddingTop: 4,
});

/** 구절 번호 버튼을 한 줄에 흘린다. */
export const dots = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: 8,
});

/** 구절 번호 버튼은 숫자 하나가 들어가는 원으로 둔다. */
export const dot = style({
  width: 44,
  padding: 0,
  fontFamily: vars.font.numeric,
});

/** 버전 변경 전 초안은 점선 상자로 제출 답안과 구분한다. */
export const draft = style({
  padding: vars.space.comfortable,
  borderRadius: vars.radius.card,
  border: `1.5px dashed ${vars.color.inputBorder}`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.compact,
  animation: `${enter} 400ms ${vars.motion.easeOut}`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});

/** 초안 제목은 본문 크기로 둔다. */
export const draftTitle = style({ fontSize: vars.fontSize.body });

/** 제출 이력은 구분선 아래 같은 간격으로 쌓는다. */
export const history = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  paddingTop: vars.space.lg,
  borderTop: `1px solid ${vars.color.line}`,
  scrollMarginTop: vars.space.lg,
});

/** 이력 섹션 제목 크기다. */
export const sectionTitle = style({ fontSize: vars.fontSize.heading3 });

/** 접힌 변경 이력 상자의 안쪽 여백을 줄인다. */
export const revisions = style({ padding: 6 });

/** 변경 이력 행을 목록 표식 없이 쌓는다. */
export const revisionList = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

/** 변경 이력 한 건의 버전, 이유와 시각을 한 줄에 두고 좁으면 줄을 바꾼다. */
export const revision = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px 12px',
  padding: '10px 0',
  borderTop: `1px solid ${vars.color.neutral}`,
  fontSize: vars.fontSize.small,
});

/** 변경 버전 번호는 숫자 글꼴로 둔다. */
export const revisionVersion = style({
  fontFamily: vars.font.numeric,
  fontWeight: vars.fontWeight.bold,
});

/** 변경 이유가 남은 폭을 차지한다. */
export const revisionReason = style({ flex: '1 1 200px', minWidth: 0 });

/** 변경 시각은 낮은 위계로 둔다. */
export const revisionTime = style({
  fontSize: vars.fontSize.label,
  color: vars.color.muted,
});

/** 동의와 최종 제출을 화면 아래에 붙여 어느 구절에서든 제출할 수 있게 한다. */
export const dock = style({
  position: 'sticky',
  bottom: 0,
  zIndex: 1,
  marginTop: 'auto',
});

/** 동의와 제출 버튼을 흰 막대 위 한 줄에 두고 좁으면 줄을 바꾼다. */
export const bar = style({
  borderTop: `1px solid ${vars.color.line}`,
  background: vars.color.surface,
  padding: `${vars.space.md} 0`,
});

/** 막대 안 내용 폭을 머리와 맞춘다. */
export const barInner = style({
  maxWidth: 1072,
  marginInline: 'auto',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '12px 20px',
});

/** 동의 문구가 버튼을 제외한 남은 폭을 차지한다. */
export const consent = style({ flex: '1 1 300px', minWidth: 0 });

/** 최종 제출 버튼은 넓게 두어 화면의 마지막 행동임을 드러낸다. */
export const submit = style({ minWidth: 220 });

/** 제출을 마치면 청록 시트가 아래에서 올라와 결과를 알린다. */
export const sheet = style({
  background: vars.color.selected,
  padding: `18px ${vars.space.lg}`,
  animation: `${rise} 320ms ${vars.motion.easeOut}`,
  '@media': {
    [reducedMotion]: { animation: 'none' },
    '(max-width: 560px)': { paddingInline: vars.space.md },
  },
});

/** 시트 안 도장, 문구와 이동 동작을 한 줄에 두고 좁으면 줄을 바꾼다. */
export const sheetInner = style({
  maxWidth: 1072,
  marginInline: 'auto',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.md,
});

/** 제출 결과 문구가 동작을 제외한 남은 폭을 차지한다. */
export const sheetText = style({ flex: '1 1 220px', minWidth: 0 });

/** 제출 결과 제목은 짙은 청록 굵은 글자로 둔다. */
export const sheetTitle = style({
  margin: 0,
  fontSize: vars.fontSize.lead,
  fontWeight: vars.fontWeight.heavy,
  color: vars.color.accentPressed,
});

/** 제출 결과 보조 문구다. */
export const sheetBody = style({
  margin: '2px 0 0',
  fontSize: vars.fontSize.small,
  color: vars.color.ink,
});
