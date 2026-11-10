import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 데스크톱 탐색 영역과 본문을 시안의 기준 폭으로 배치한다. */
export const shell = style({
  display: 'grid',
  gridTemplateColumns: vars.layout.sidebar + ' minmax(0, 1fr)',
  minHeight: '100vh',
  borderTop: '4px solid ' + vars.color.accent,
  background: vars.color.surface,
});

/** 학습 전용 화면에는 별도 도구 모음을 위한 전체 폭을 제공한다. */
export const immersive = style({
  minHeight: '100vh',
  borderTop: '4px solid ' + vars.color.accent,
  background: vars.color.surface,
});

/** 페이지가 길어져도 탐색과 계정 진입을 같은 위치에 유지한다. */
export const sidebar = style({
  position: 'sticky',
  top: 0,
  alignSelf: 'start',
  height: 'calc(100vh - 4px)',
  minHeight: 760,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 16,
  background: vars.color.canvas,
});

/** 서비스 이름을 학습 앱의 일관된 시작점으로 제공한다. */
export const brand = style({
  fontFamily: vars.font.body,
  color: vars.color.accent,
  fontWeight: 700,
  fontSize: 23,
  lineHeight: '30px',
  textDecoration: 'none',
  padding: 4,
  marginBottom: 30,
});

/** 계정 소유의 학습 공간임을 탐색 위에서 확인하게 한다. */
export const workspace = style({
  display: 'flex',
  alignItems: 'center',
  gap: 9,
  minHeight: 44,
  padding: 10,
  borderRadius: vars.radius.control,
  background: vars.color.surface,
  color: vars.color.ink,
  fontSize: vars.fontSize.caption,
  textDecoration: 'none',
  marginBottom: 24,
});

/** 계정 이미지가 없어도 같은 크기의 식별 표시를 제공한다. */
export const avatar = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 'none',
  width: 30,
  height: 30,
  borderRadius: '50%',
  background: vars.color.neutral,
  color: vars.color.ink,
  fontSize: vars.fontSize.caption,
});

globalStyle('.' + workspace + ' .' + avatar, {
  width: 24,
  height: 24,
  fontSize: 10,
});

/** 목적지를 세로로 나열하면서 현재 위치를 글자와 배경으로 알린다. */
export const navigation = style({
  display: 'grid',
  gap: 8,
  minHeight: 0,
  overflowY: 'auto',
  scrollbarWidth: 'thin',
});

/** 메뉴 항목은 클릭 영역과 현재 위치를 같은 방식으로 표시한다. */
export const navItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  minHeight: 40,
  padding: '6px 10px',
  borderRadius: vars.radius.control,
  textDecoration: 'none',
  fontSize: vars.fontSize.small,
  lineHeight: '20px',
  fontWeight: 500,
  color: vars.color.muted,
  selectors: {
    '&:hover': { background: vars.color.selected, color: vars.color.accent },
    '&[aria-current="page"]': {
      background: vars.color.selected,
      color: vars.color.accent,
    },
  },
});

/** 지원하는 학습 언어를 메뉴와 낮은 위계로 구분한다. */
export const languages = style({
  display: 'grid',
  gap: 14,
  marginTop: 30,
  padding: '0 8px',
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
});

globalStyle('.' + languages + ' h2', {
  fontSize: 10,
  fontWeight: 500,
  color: vars.color.muted,
  marginBottom: 0,
});

globalStyle('.' + languages + ' p', {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  margin: 0,
});

/** 언어를 구별하는 작은 표시는 본문 강조색과 분리한다. */
export const languageDot = style({
  width: 7,
  height: 7,
  borderRadius: '50%',
  background: vars.color.accent,
  selectors: { '&[data-language="th"]': { background: vars.color.review } },
});

/** 하단 도움말과 계정 영역을 내용 길이와 무관하게 정렬한다. */
export const bottom = style({
  display: 'grid',
  gap: 24,
  marginTop: 'auto',
  paddingTop: 32,
});

/** 질문을 시작할 경로를 일상적인 문구로 안내한다. */
export const help = style({
  display: 'grid',
  gap: 8,
  padding: 12,
  border: '1px solid ' + vars.color.line,
  borderRadius: vars.radius.panel,
  background: vars.color.neutral,
  color: vars.color.ink,
  textDecoration: 'none',
  fontSize: vars.fontSize.caption,
});

globalStyle('.' + help + ' span', { color: vars.color.muted, fontSize: 11 });

/** 계정 설정으로 이동하는 영역은 이름이 길어져도 폭을 유지한다. */
export const account = style({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '14px 6px 6px',
  borderTop: '1px solid ' + vars.color.line,
  color: vars.color.ink,
  textDecoration: 'none',
  fontSize: 11,
});

/** 계정 이름과 역할의 읽는 순서를 고정한다. */
export const accountInfo = style({
  flex: 1,
  minWidth: 0,
  display: 'grid',
  gap: 2,
});

globalStyle('.' + accountInfo + ' strong', {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontWeight: 500,
});

globalStyle('.' + accountInfo + ' small', {
  fontSize: 10,
  color: vars.color.muted,
});

/** 본문 안의 긴 자료 제목이 전체 페이지 폭을 늘리지 않게 한다. */
export const main = style({ minWidth: 0 });

/** 현재 위치와 실제 탐색 동작을 상단에 모은다. */
export const topbar = style({
  minHeight: vars.layout.topbar,
  padding: '0 ' + vars.layout.contentPadding,
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  borderBottom: '1px solid ' + vars.color.line,
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
});

/** 현재 위치가 늘어나도 보조 탐색을 오른쪽에 유지한다. */
export const breadcrumb = style({ flex: 1 });

/** 자료 검색은 실제 자료 목록으로 이동하는 링크로 제공한다. */
export const search = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 10,
  minWidth: 140,
  color: vars.color.muted,
  textDecoration: 'none',
});

/** 인증 화면의 본문은 공통 여백을 한 번만 적용한다. */
export const content = style({
  padding: '30px ' + vars.layout.contentPadding + ' 48px',
  maxWidth: 1600,
  margin: '0 auto',
});
