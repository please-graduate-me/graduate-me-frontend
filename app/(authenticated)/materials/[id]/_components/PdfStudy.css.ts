import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** PDF 학습은 내비게이션 대신 원문에 데스크톱 창 전체를 사용한다. */
export const root = style({
  minWidth: 1120,
  minHeight: '100vh',
  background: vars.color.surface,
});

/** 자료 제목과 읽기 위치를 원본 위의 얇은 막대에 모은다. */
export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.compact,
  height: 64,
  paddingInline: vars.space.comfortable,
  borderBottom: `1px solid ${vars.color.line}`,
  background: vars.color.surface,
});

/** 목록으로 돌아가는 동작은 손가락으로도 누르기 쉬운 크기로 둔다. */
export const back = style({
  width: 44,
  height: 44,
  flexShrink: 0,
  display: 'grid',
  placeItems: 'center',
  borderRadius: 12,
  color: vars.color.muted,
  selectors: { '&:hover': { background: vars.color.canvas } },
});

/** 자료 이름은 남은 공간을 사용하고 출처 안내를 위에 작게 둔다. */
export const title = style({
  flex: '1 1 240px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
});

/** 읽기 위치 막대와 쪽수는 제목 옆에서 줄지 않게 묶는다. */
export const progress = style({
  flex: '0 1 260px',
  minWidth: 160,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
});

/** 진행 막대는 쪽수 글자를 뺀 폭을 채운다. */
export const progressBar = style({ flex: 1, minWidth: 0 });

/** 쪽수는 자릿수가 바뀌어도 폭이 흔들리지 않게 고정폭 숫자로 쓴다. */
export const progressText = style({
  flexShrink: 0,
  whiteSpace: 'nowrap',
  color: vars.color.muted,
  fontSize: 13,
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
});

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
  // 머리 막대 64px와 도구 모음 56px을 뺀 높이라 두 영역 높이를 바꾸면 함께 고친다.
  height: 'calc(100vh - 120px)',
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
  padding: '16px 12px',
  overflowY: 'auto',
  borderRight: `1px solid ${vars.color.line}`,
  background: vars.color.surface,
});

/** 원본은 회색 바탕 가운데에서만 스크롤하고 확대 시 좌우 영역을 보존한다. */
export const canvas = style({
  display: 'flex',
  alignItems: 'flex-start',
  // safe는 페이지가 넓어져도 왼쪽이 잘리지 않게 하고, 미지원 브라우저는 왼쪽 정렬로 돌아간다.
  justifyContent: 'safe center',
  // 맞춤 배율 계산이 좌우 여백 100px을 전제하므로 바꾸지 않는다.
  padding: 50,
  overflow: 'auto',
  minWidth: 0,
  background: vars.color.canvas,
});

/** 구절 학습 도구는 원본 오른쪽에서 독립적으로 스크롤한다. */
export const sidebar = style({
  padding: vars.space.comfortable,
  borderLeft: `1px solid ${vars.color.line}`,
  background: vars.color.surface,
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

/** 선택한 발췌는 따뜻한 종이색 카드에 담아 전체 자료와 구분한다. */
export const passage = style({
  padding: vars.space.md,
  margin: '16px 0 24px',
  borderRadius: 16,
  border: '1px solid #FBE3C2',
  background: '#FFF8EE',
  color: '#16181D',
});

/** 발췌 원문은 원본과 같은 세리프로 읽히게 하고 긴 문장도 카드 안에 둔다. */
export const quote = style({
  margin: 0,
  fontFamily: vars.font.document,
  fontSize: 16,
  fontWeight: 600,
  lineHeight: 1.6,
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

/** 새 AI 요청 제한은 원본 읽기와 구분해 안내한다. */
export const notice = style({
  color: vars.color.warning,
  background: vars.color.notice,
  padding: vars.space.md,
  borderRadius: vars.radius.control,
  fontSize: 13,
  lineHeight: 1.7,
});

/** 문서 전체 정리와 구절별 학습을 같은 높이의 탭으로 구분한다. */
export const tabs = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: 8,
  marginBottom: 20,
});

/** 원본의 추가 동작은 주 학습 도구를 밀지 않는 메뉴에 둔다. */
export const more = style({ position: 'relative' });

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

globalStyle(`${quote} small`, {
  display: 'block',
  marginBottom: vars.space.xxs,
  fontFamily: vars.font.body,
  fontSize: 12,
  fontWeight: 700,
  color: '#5B6070',
});
