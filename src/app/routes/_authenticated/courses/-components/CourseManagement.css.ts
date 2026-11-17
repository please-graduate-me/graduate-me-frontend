import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 수업 관리 열은 고정 폭으로 두어 과제 목록 폭 변화에 흔들리지 않게 한다. */
export const root = style({
  flex: '1 1 360px',
  maxWidth: 400,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  '@media': { '(max-width: 960px)': { maxWidth: 'none' } },
});

/** 관리 열 제목은 과제 열 제목과 같은 크기로 둔다. */
export const title = style({ fontSize: 20 });

/** 초대 코드는 먹색 면 위 큰 숫자 글꼴로 공유하기 쉽게 보여 준다. */
export const invite = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: vars.space.comfortable,
  borderRadius: vars.radius.panel,
  background: vars.color.ink,
  color: vars.color.onAccent,
});

/** 초대 코드 이름은 어두운 면 위 옅은 회색으로 둔다. */
export const inviteLabel = style({
  margin: 0,
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.inputBorder,
});

/** 초대 코드 값은 글자 사이를 넓혀 읽어 주기 쉽게 한다. */
export const inviteCode = style({
  margin: 0,
  fontFamily: vars.font.numeric,
  fontSize: 26,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: '0.08em',
  overflowWrap: 'anywhere',
});

/** 카드 안 요소를 세로로 쌓는다. */
export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.compact,
});

/** 카드 안 소제목은 본문보다 조금 작게 둔다. */
export const cardTitle = style({ fontSize: 15 });

/** 역할 선택과 저장 버튼을 아래 기준선에 맞춰 한 줄에 둔다. */
export const roleRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  gap: 8,
});

/** 역할 선택이 버튼을 제외한 남은 폭을 사용한다. */
export const roleField = style({ flex: '1 1 120px', minWidth: 0 });

/** 구성원 목록 카드의 아래 여백은 마지막 행 간격으로 대신한다. */
export const members = style({ paddingBottom: 8 });

/** 구성원 수는 숫자 글꼴의 보조색으로 덧붙인다. */
export const count = style({
  marginLeft: 6,
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.muted,
});

/** 구성원 행을 목록 표식 없이 쌓는다. */
export const list = style({ listStyle: 'none', margin: '4px 0 0', padding: 0 });

/** 구성원 한 명의 아바타, 이름과 조작을 한 줄에 두고 좁으면 줄을 바꾼다. */
export const member = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '8px 10px',
  padding: '10px 0',
  borderTop: `1px solid ${vars.color.neutral}`,
});

/** 아바타가 줄어들지 않게 고정한다. */
export const avatar = style({ flex: '0 0 auto', display: 'inline-flex' });

/** 이름과 역할이 조작을 제외한 남은 폭을 차지한다. */
export const who = style({
  flex: '1 1 0',
  minWidth: 64,
  display: 'flex',
  flexDirection: 'column',
});

/** 구성원 이름이다. */
export const name = style({
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.heavy,
  overflowWrap: 'anywhere',
});

/** 구성원 역할은 이름보다 낮은 위계로 둔다. */
export const role = style({
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.muted,
});

/** 행 안 역할 선택은 좁은 고정 폭으로 둔다. */
export const memberSelect = style({ width: 128 });

/** 제외 확인창의 역할은 이름보다 낮은 위계로 둔다. */
export const confirmRole = style({
  fontWeight: vars.fontWeight.bold,
  color: vars.color.muted,
});
