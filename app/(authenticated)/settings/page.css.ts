import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 계정 열과 설정 열을 넓은 화면 읽기 폭 안에 둔다. */
export const page = style({
  maxWidth: 1120,
  marginInline: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
  minWidth: 0,
});

/** 설정 목적을 제목 가까이에 표시한다. */
export const intro = style({ minWidth: 0 });

/** 제목 아래 안내 문장의 간격이다. */
export const lead = style({ marginTop: vars.space.xs });

/** 좁은 화면에서는 계정 열이 설정 위로 접히도록 줄바꿈을 허용한다. */
export const columns = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: vars.space.xl,
});

/** 계정, 작업 공간, 개인정보 안내를 한 열에 쌓는다. */
export const aside = style({
  flex: '1 1 280px',
  maxWidth: 340,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  '@media': { '(max-width: 800px)': { maxWidth: 'none' } },
});

/** 실제 학습 설정 편집 영역이 남은 폭을 모두 쓴다. */
export const main = style({
  flex: '999 1 560px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
});

/** 사이드 카드 안의 항목 간격만 정한다. */
export const sideCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.compact,
});

/** 카드 이름을 작은 보조 제목으로 낮춘다. */
export const eyebrow = style({
  fontSize: vars.fontSize.label,
  color: vars.color.muted,
});

/** 사이드 카드 제목 크기다. */
export const sideTitle = style({ fontSize: vars.fontSize.body });

/** 이니셜과 이름, 이메일을 한 줄에 묶는다. */
export const identity = style({
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  minWidth: 0,
});

/** 긴 이메일이 카드 폭을 밀어내지 않게 한다. */
export const identityText = style({ minWidth: 0 });

/** 계정 이름을 이메일보다 먼저 읽히게 한다. */
export const name = style({
  display: 'block',
  fontSize: 17,
  fontWeight: vars.fontWeight.heavy,
});

/** 긴 이메일 주소를 어디서든 줄바꿈한다. */
export const email = style({ marginTop: 2, overflowWrap: 'anywhere' });

/** 공간 표지와 로그아웃을 양 끝에 두고 좁으면 줄바꿈한다. */
export const accountActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
});

/** 도우미·운영 작업 공간은 학생 설정과 다른 공간임을 어두운 면으로 구분한다. */
export const workspace = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  padding: vars.space.comfortable,
  borderRadius: vars.radius.panel,
  background: vars.color.ink,
  color: vars.color.onAccent,
});

/** 어두운 면 위의 방패 아이콘 타일이다. */
export const workspaceIcon = style({
  width: 40,
  height: 40,
  borderRadius: vars.radius.control,
  background: '#2B2F38',
  color: '#7FE0C2',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

/** 어두운 면 위에서도 대비가 남는 옅은 본문색이다. */
export const workspaceText = style({
  color: '#D6D8DD',
  fontSize: vars.fontSize.small,
  lineHeight: 1.6,
});

/** 작업 공간 이동을 카드 폭 전체의 주 행동으로 둔다. */
export const workspaceLink = style({ marginTop: vars.space.xs, width: '100%' });

/** 탈퇴 안내 링크를 화살표와 함께 터치 높이로 둔다. */
export const chevronLink = style({
  alignSelf: 'flex-start',
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xxs,
  minHeight: 44,
  color: vars.color.ink,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.heavy,
});

/** 설정 카드 안의 넓은 여백과 항목 간격이다. */
export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  padding: 28,
  '@media': { '(max-width: 800px)': { padding: vars.space.comfortable } },
});

/** 카드 아이콘 타일과 제목을 한 줄에 둔다. */
export const panelHeading = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.compact,
});

/** 설정 카드 제목 크기다. */
export const panelTitle = style({ fontSize: 20 });

/** 카드 제목 앞의 둥근 사각 아이콘 자리다. */
export const iconTile = style({
  width: 40,
  height: 40,
  flex: 'none',
  borderRadius: vars.radius.control,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

/** 카드 성격마다 아이콘 타일 색을 짝지어 구분한다. */
export const tileTone = styleVariants({
  review: { background: vars.color.reviewBackground, color: vars.color.review },
  streak: { background: vars.color.streakBackground, color: vars.color.streak },
});
