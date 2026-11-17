import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 제목, 조회 조건, 분석, 추천 목록을 세로로 쌓는다. */
export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.lg,
  minWidth: 0,
});

/** 제목과 직접 등록 동작을 아래 기준선으로 맞춘다. */
export const header = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: vars.space.md,
});

/** 제목 아래 설명이다. */
export const description = style({
  marginTop: vars.space.xs,
  fontSize: 15,
});

/** 언어 선택과 조회 동작을 회색 띠에 담는다. */
export const filters = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  gap: vars.space.compact,
  padding: '16px 20px',
  borderRadius: vars.radius.panel,
  background: vars.color.canvas,
});

/** 언어 선택 폭을 짧은 선택지에 맞춘다. */
export const language = style({ flex: '0 1 180px', minWidth: 0 });

/** 관심·수준 설정은 띠 오른쪽 끝에 둔다. */
export const settings = style({ marginLeft: 'auto' });

/** AI 사용 한도 안내는 띠 아래 줄 전체를 쓴다. */
export const filterNote = style({
  flex: '1 1 100%',
  fontSize: vars.fontSize.caption,
  lineHeight: 1.6,
});

/** 기록 분석과 추천 기준 안내를 나란히 둔다. */
export const overview = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'stretch',
  gap: vars.space.lg,
});

/** 개인 기록 분석은 어두운 면으로 목록과 구분한다. */
export const analysis = style({
  flex: '999 1 520px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  padding: vars.space.lg,
  borderRadius: vars.radius.tray,
  background: vars.color.ink,
  color: vars.color.onAccent,
});

/** 분석 제목과 아이콘을 나란히 둔다. */
export const analysisHeading = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.compact,
});

/** 어두운 면 위의 아이콘 상자다. */
export const analysisIcon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: vars.radius.control,
  background: '#2B2F38',
  color: '#7FE0C2',
});

/** 분석 제목이다. */
export const analysisTitle = style({ fontSize: 17 });

/** 분석 요약 본문이다. */
export const summary = style({
  color: vars.color.neutral,
  fontSize: 15,
  lineHeight: 1.7,
  whiteSpace: 'pre-wrap',
});

/** 집중할 영역 목록이다. */
export const focusList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

/** 집중할 영역 한 줄이다. */
export const focus = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: '10px 14px',
  borderRadius: vars.radius.control,
  background: '#2B2F38',
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
});

/** 집중할 영역 앞 확인 표시다. */
export const focusMark = style({ color: '#7FE0C2' });

/** 분석 근거 수와 시각이다. */
export const analysisMeta = style({
  color: vars.color.inputBorder,
  fontSize: vars.fontSize.caption,
});

/** 분석 전 첫 AI 추천 버튼은 내용 폭만 쓴다. */
export const analysisAction = style({ alignSelf: 'flex-start' });

/** 추천 기준 안내 열이다. */
export const basis = style({
  flex: '1 1 280px',
  maxWidth: 360,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  borderRadius: vars.radius.tray,
  '@media': { '(max-width: 900px)': { maxWidth: 'none' } },
});

/** 안내 아이콘은 정보 색으로 둔다. */
export const basisIcon = style({ color: vars.color.info });

/** 추천 기준 본문이다. */
export const basisText = style({
  color: '#33363F',
  fontSize: vars.fontSize.label,
  lineHeight: 1.7,
});

/** 난이도 추정 안내다. */
export const basisNote = style({
  fontSize: vars.fontSize.caption,
  lineHeight: 1.6,
});

/** 목록 제목, 개수, 카드를 묶는다. */
export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

/** 목록 제목과 개수를 같은 기준선에 둔다. */
export const listHeading = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: vars.space.sm,
});

/** 목록 제목이다. */
export const listTitle = style({ fontSize: vars.fontSize.lead });

/** 추천 개수는 숫자 글꼴로 둔다. */
export const count = style({
  color: vars.color.muted,
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
});

/** 추천 카드를 폭에 맞춰 여러 열로 채운다. */
export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
  gap: 18,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});
