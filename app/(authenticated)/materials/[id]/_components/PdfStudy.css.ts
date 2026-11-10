import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** PDF 학습은 내비게이션 대신 원문에 데스크톱 창 전체를 사용한다. */
export const root = style({
  minWidth: 1120,
  minHeight: '100vh',
  borderTop: `4px solid ${vars.color.accent}`,
  background: vars.color.surface,
});

/** 자료 제목과 개인 공개 범위를 원본 위에 표시한다. */
export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
  height: 76,
  paddingInline: vars.space.lg,
  borderBottom: `1px solid ${vars.color.line}`,
});

/** 목록으로 돌아가는 동작을 작은 아이콘 링크로 제공한다. */
export const back = style({
  width: 32,
  height: 32,
  display: 'grid',
  placeItems: 'center',
  color: vars.color.muted,
});

/** 자료 이름은 남은 공간을 사용한다. */
export const title = style({ flex: 1, minWidth: 0 });

/** 원본 파일은 별도 창에서도 열 수 있다. */
export const download = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  padding: '8px 12px',
  border: `1px solid ${vars.color.line}`,
  borderRadius: vars.radius.control,
  fontSize: 13,
  textDecoration: 'none',
  color: vars.color.ink,
});

/** 페이지 목록과 원문 및 구절 패널을 고정된 세 영역으로 구분한다. */
export const workspace = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 420px',
  height: 'calc(100vh - 132px)',
  minHeight: 600,
  selectors: {
    '&[data-thumbnails]': { gridTemplateColumns: '104px minmax(0, 1fr) 420px' },
    '&[data-panel-closed]': { gridTemplateColumns: 'minmax(0, 1fr)' },
    '&[data-thumbnails][data-panel-closed]': {
      gridTemplateColumns: '104px minmax(0, 1fr)',
    },
  },
});

/** 실제 페이지 미리 보기는 원문과 구분되는 작은 탐색 열에 둔다. */
export const thumbnails = style({
  padding: '20px 12px',
  overflowY: 'auto',
  borderRight: `1px solid ${vars.color.line}`,
  background: vars.color.canvas,
});

/** 원본은 가운데에서만 스크롤하고 확대 시 좌우 영역을 보존한다. */
export const canvas = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  padding: 50,
  overflow: 'auto',
  minWidth: 0,
  background: '#edeff2',
});

/** 구절 학습 도구는 원본 오른쪽에서 독립적으로 스크롤한다. */
export const sidebar = style({
  padding: 26,
  borderLeft: `1px solid ${vars.color.line}`,
  overflowY: 'auto',
  minWidth: 0,
});

/** 패널의 주제를 아이콘과 실제 제목으로 함께 표시한다. */
export const panelHeading = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  marginBottom: 20,
});

/** 선택한 발췌만 강조해 전체 자료와 구분한다. */
export const quote = style({
  padding: vars.space.md,
  margin: '16px 0 24px',
  borderRadius: vars.radius.control,
  background: vars.color.canvas,
  fontSize: 14,
  lineHeight: '22px',
  overflowWrap: 'anywhere',
  whiteSpace: 'pre-wrap',
});

/** 저장과 질문을 관련 설명과 함께 묶는다. */
export const section = style({
  paddingBlock: vars.space.md,
  borderBlock: `1px solid ${vars.color.line}`,
});

/** 제공되지 않는 기능은 실제 기능과 구분해 안내한다. */
export const capability = style({
  display: 'flex',
  alignItems: 'start',
  gap: vars.space.sm,
  marginTop: vars.space.lg,
  color: vars.color.muted,
  fontSize: 13,
  lineHeight: 1.8,
});

/** 개인 메모는 긴 문장도 입력할 수 있는 높이를 확보한다. */
export const memo = style({ minHeight: 320, marginBlock: '16px 20px' });

/** 읽기 도구 설명은 본문보다 낮은 위계로 둔다. */
export const description = style({
  color: vars.color.muted,
  fontSize: 14,
  lineHeight: 1.8,
});

/** 저장 시각과 원문 위치는 작은 숫자로 표시한다. */
export const meta = style({
  color: vars.color.muted,
  fontSize: 12,
  lineHeight: 1.6,
});

/** 로드와 저장 실패를 명확한 메시지로 표시한다. */
export const error = style({
  color: vars.color.error,
  background: vars.color.errorBackground,
  padding: '12px 24px',
  margin: 0,
  fontSize: 14,
});

globalStyle(`${title} h1`, {
  margin: 0,
  fontSize: 14,
  lineHeight: '20px',
  fontWeight: 500,
});

globalStyle(`${title} p`, {
  margin: '4px 0 0',
  color: vars.color.muted,
  fontSize: 12,
});

globalStyle(`${panelHeading} h2`, { margin: 0, fontSize: 17 });
globalStyle(`${section} h3`, { margin: 0, fontSize: 18 });
globalStyle(`${capability} p`, { margin: 0 });

/** 새 AI 요청 제한은 원본 읽기와 구분해 안내한다. */
export const notice = style({
  color: vars.color.warning,
  background: vars.color.notice,
  padding: vars.space.md,
  borderRadius: vars.radius.control,
  fontSize: 13,
  lineHeight: 1.7,
});

/** 탭은 설명·개인 기록·공유 질문의 작업 맥락을 구분한다. */
export const tabs = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 24,
  marginBottom: 20,
});

globalStyle(`${tabs} button`, {
  height: 44,
  border: 0,
  borderBottom: '2px solid transparent',
  color: vars.color.muted,
  background: 'transparent',
  font: 'inherit',
  fontSize: 14,
  cursor: 'pointer',
});

globalStyle(`${tabs} button[aria-selected="true"]`, {
  borderBottomColor: vars.color.accent,
  color: vars.color.ink,
});

globalStyle(`${tabs} button:focus-visible`, {
  outline: `2px solid ${vars.color.focus}`,
  outlineOffset: 2,
});

/** 원본의 추가 동작은 주 학습 도구를 밀지 않는 메뉴에 둔다. */
export const more = style({ position: 'relative' });

globalStyle(`${more} > summary`, {
  listStyle: 'none',
  display: 'grid',
  placeItems: 'center',
  width: 32,
  height: 32,
  cursor: 'pointer',
});

/** 메뉴는 헤더 아래에 열려 원본 위치를 바꾸지 않는다. */
export const moreMenu = style({
  position: 'absolute',
  right: 0,
  top: 40,
  minWidth: 220,
  padding: 8,
  display: 'grid',
  gap: 6,
  background: vars.color.surface,
  boxShadow: vars.shadow.popover,
  borderRadius: vars.radius.panel,
  zIndex: 6,
});

/** 페이지 단위 준비는 선택 설명과 구분하되 스캔본에서는 바로 찾게 한다. */
export const preparation = style({
  marginTop: 24,
  paddingBlock: 16,
  borderTop: `1px solid ${vars.color.line}`,
  fontSize: 13,
  lineHeight: 1.7,
});

globalStyle(`${quote} small`, { fontSize: 12, color: vars.color.muted });
globalStyle(`${quote} p`, { margin: '6px 0 0' });

globalStyle(`${panelHeading} h2`, { flex: 1, fontSize: 16, fontWeight: 400 });
