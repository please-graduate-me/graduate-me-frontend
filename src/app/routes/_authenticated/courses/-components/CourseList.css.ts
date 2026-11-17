import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const reducedMotion = '(prefers-reduced-motion: reduce)';

/** 제목, 참여·개설 영역, 수업 목록을 넓은 간격으로 쌓는다. */
export const page = style({
  maxWidth: 1120,
  marginInline: 'auto',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 36,
});

/** 제목 아래 설명은 제목보다 낮은 위계로 붙인다. */
export const description = style({ marginTop: 6 });

/** 초대 코드 참여를 넓게, 수업 개설을 좁게 나란히 두고 좁은 화면에서는 쌓는다. */
export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: vars.space.comfortable,
});

/** 초대 코드 참여는 먹색 면으로 화면의 첫 행동임을 드러낸다. */
export const join = style({
  flex: '999 1 520px',
  minWidth: 0,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.lg,
  padding: 28,
  borderRadius: vars.radius.tray,
  background: vars.color.ink,
  color: vars.color.onAccent,
  '@media': { '(max-width: 560px)': { padding: vars.space.comfortable } },
});

/** 입장권 그림은 줄어들지 않게 고정한다. */
export const ticket = style({ flex: '0 0 auto' });

/** 입장권 몸통은 밝은 청록으로 칠한다. */
export const ticketBody = style({ fill: vars.color.accentBright });

/** 입장권 양옆 홈은 카드 바탕색으로 뚫린 것처럼 보이게 한다. */
export const ticketNotch = style({ fill: vars.color.ink });

/** 입장권 절취선이다. */
export const ticketCut = style({ stroke: vars.color.accent });

/** 입장권 위 글줄은 흰색으로 둔다. */
export const ticketLine = style({ fill: vars.color.onAccent });

/** 입장권 위 둘째 글줄은 옅은 청록으로 둔다. */
export const ticketLineSoft = style({ fill: vars.color.accentLine });

/** 입장권 확인 표시다. */
export const ticketCheck = style({ stroke: vars.color.onAccent });

/** 참여 제목, 입력과 오류를 세로로 묶는다. */
export const joinBody = style({
  flex: '1 1 300px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
});

/** 어두운 면 위 제목은 흰 글자로 둔다. */
export const joinTitle = style({ color: vars.color.onAccent, fontSize: 20 });

/** 초대 코드 입력과 참여 버튼을 아래 기준선에 맞춰 한 줄에 둔다. */
export const joinForm = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  gap: vars.space.sm,
});

/** 초대 코드 입력이 버튼을 제외한 남은 폭을 사용한다. */
export const joinField = style({
  flex: '1 1 220px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
});

/** 어두운 면 위 입력 이름은 옅은 회색으로 읽히게 한다. */
export const joinLabel = style({
  color: vars.color.lineStrong,
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
});

/** 수업 개설은 접힌 흰 카드로 두어 참여보다 낮은 위계를 갖게 한다. */
export const create = style({
  flex: '1 1 300px',
  minWidth: 0,
  padding: vars.space.sm,
});

/** 접힘 제목 앞의 더하기 아이콘 칸이다. */
export const createIcon = style({
  width: 40,
  height: 40,
  flex: '0 0 auto',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: vars.radius.control,
  background: vars.color.reviewBackground,
  color: vars.color.review,
});

/** 접힘 제목 글자를 본문 크기로 키운다. */
export const createTrigger = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.compact,
  fontSize: vars.fontSize.body,
  fontWeight: vars.fontWeight.heavy,
});

/** 수업 개설 입력을 세로로 쌓는다. */
export const createForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
});

/** 참여한 수업 제목 줄과 목록을 묶는다. */
export const mine = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

/** 제목 앞 아이콘 칸과 제목을 한 줄에 둔다. */
export const mineHeading = style({
  display: 'flex',
  alignItems: 'center',
  gap: 14,
});

/** 참여한 수업 제목 앞 파란 아이콘 칸이다. */
export const mineIcon = style({
  width: 44,
  height: 44,
  flex: '0 0 auto',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: vars.radius.control,
  background: vars.color.infoBackground,
  color: vars.color.info,
});

/** 참여한 수업 제목은 본문보다 조금 크게 둔다. */
export const mineTitle = style({ fontSize: vars.fontSize.heading3 });

/** 수업 수는 숫자 글꼴의 보조색으로 덧붙인다. */
export const count = style({
  marginLeft: vars.space.xs,
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.body,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.muted,
});

/** 수업 타일을 회색 쟁반 위 격자로 늘어놓는다. */
export const grid = style({
  listStyle: 'none',
  margin: 0,
  padding: vars.space.comfortable,
  borderRadius: vars.radius.tray,
  background: vars.color.canvas,
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: vars.space.md,
  '@media': { '(max-width: 560px)': { padding: vars.space.compact } },
});

/** 격자 칸 안에서 타일이 같은 높이로 늘어나게 한다. */
export const cell = style({ display: 'flex', minWidth: 0 });

/** 개인 학습 바로가기는 점선 빈 타일로 두어 수업과 구분한다. */
export const personal = style({
  flex: '1 1 auto',
  minHeight: 220,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
  padding: vars.space.comfortable,
  borderRadius: vars.radius.panel,
  border: `1.5px dashed ${vars.color.inputBorder}`,
  color: vars.color.ink,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.heavy,
  textAlign: 'center',
  textDecoration: 'none',
  transition: `transform ${vars.motion.base} ${vars.motion.easeOut}, border-color ${vars.motion.base} ${vars.motion.easeOut}`,
  selectors: {
    '&:hover': {
      color: vars.color.ink,
      textDecoration: 'none',
      transform: 'translateY(-3px)',
      borderColor: vars.color.muted,
    },
  },
  '@media': {
    [reducedMotion]: {
      transition: 'none',
      selectors: { '&:hover': { transform: 'none' } },
    },
  },
});

/** 개인 학습 바로가기의 문서 아이콘 원이다. */
export const personalIcon = style({
  width: 48,
  height: 48,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  border: `1px solid ${vars.color.line}`,
  background: vars.color.surface,
});

/** 빈 상태 칠판 그림의 회색 판이다. */
export const emptyBoard = style({ fill: vars.color.line });

/** 빈 상태 칠판 위 흰 글줄이다. */
export const emptyLine = style({ fill: vars.color.surface });

/** 빈 상태 더하기 표시의 연청록 원이다. */
export const emptyPlusCircle = style({ fill: vars.color.selected });

/** 빈 상태 더하기 표시의 청록 선이다. */
export const emptyPlus = style({ stroke: vars.color.accent });
