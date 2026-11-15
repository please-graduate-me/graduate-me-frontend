import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 돌아가기, 수업 제목, 안내와 본문 열을 읽는 순서대로 쌓는다. */
export const page = style({
  maxWidth: 1120,
  marginInline: 'auto',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 22,
});

/** 돌아가기 링크가 행 전체로 늘어나지 않게 한다. */
export const back = style({ alignSelf: 'flex-start' });

/** 언어와 내 역할 표지, 수업 제목을 가까이 묶는다. */
export const title = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  marginTop: -8,
});

/** 언어와 역할 표지를 한 줄에 흘린다. */
export const badges = style({ display: 'flex', flexWrap: 'wrap', gap: 8 });

/** 과제 목록을 넓게, 수업 관리를 좁게 나란히 두고 좁은 화면에서는 쌓는다. */
export const columns = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: vars.space.xl,
  marginTop: 6,
});

/** 과제 목록 열이 남은 폭을 차지하고 긴 제목이 관리 열을 밀지 않게 한다. */
export const assignments = style({
  flex: '999 1 560px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

/** 과제 제목과 과제 만들기 동작을 한 줄 양 끝에 둔다. */
export const assignmentsHeading = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.compact,
});

/** 과제 수는 숫자 글꼴의 보조색으로 덧붙인다. */
export const count = style({
  marginLeft: vars.space.xs,
  fontFamily: vars.font.numeric,
  fontSize: 17,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.muted,
});

/** 과제 열 제목은 섹션 제목 크기로 둔다. */
export const sectionTitle = style({ fontSize: 20 });

/** 과제가 없을 때 점선 자리로 빈 목록임을 알린다. */
export const empty = style({
  margin: 0,
  padding: vars.space.xl,
  border: `1.5px dashed ${vars.color.lineStrong}`,
  borderRadius: vars.radius.card,
  textAlign: 'center',
  color: vars.color.muted,
  fontSize: 15,
});

/** 과제 카드를 목록 표식 없이 일정한 간격으로 쌓는다. */
export const list = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
});
