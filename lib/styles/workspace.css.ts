import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 학습 자료와 표현집 화면의 본문 너비를 일정하게 유지한다. */
export const page = style({
  maxWidth: 1360,
  marginInline: 'auto',
  minWidth: 0,
});

/** 제목과 대표 동작의 기준선을 맞춘다. */
export const heading = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.lg,
  marginBottom: vars.space.xl,
});

/** 제목 아래 설명은 주요 행동보다 낮은 위계로 둔다. */
export const description = style({
  color: vars.color.muted,
  fontSize: 14,
  marginBlock: '8px 0',
  lineHeight: 1.7,
});

/** 원문과 대화를 함께 비교할 수 있는 두 열을 만든다. */
export const columns = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.12fr) minmax(340px, 1fr)',
  gap: vars.space.lg,
  alignItems: 'start',
});

/** 출처 보조 정보가 본문을 밀어내지 않게 한다. */
export const questionColumns = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.55fr) minmax(320px, 1fr)',
  gap: vars.space.xl,
  alignItems: 'start',
});

/** 목록과 읽기 영역을 패널 경계로 구분한다. */
export const panel = style({
  padding: vars.space.lg,
  borderRadius: vars.radius.panel,
  background: vars.color.surface,
  border: `1px solid ${vars.color.line}`,
  minWidth: 0,
});

/** 출처와 부가 정보를 학습 본문과 구분한다. */
export const sourcePanel = style({
  padding: vars.space.lg,
  borderRadius: vars.radius.panel,
  background: vars.color.selected,
  minWidth: 0,
});

/** 본문 안의 주요 표현을 명확한 크기로 읽게 한다. */
export const expressionTitle = style({
  margin: '8px 0 16px',
  fontSize: 28,
  fontWeight: 500,
  lineHeight: 1.45,
  overflowWrap: 'anywhere',
});

/** 입력 영역과 부가 동작을 수평으로 배치한다. */
export const row = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  flexWrap: 'wrap',
});

/** 분리된 학습 입력을 읽는 순서대로 쌓는다. */
export const stack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
});

/** 질문과 메모의 입력 이름을 입력창 가까이에 둔다. */
export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  fontSize: 14,
  fontWeight: 500,
});

/** 목록 검색과 상태 선택을 같은 줄에 모은다. */
export const filters = style({
  display: 'flex',
  gap: vars.space.sm,
  marginBlock: '0 24px',
  alignItems: 'center',
});

/** 목록을 읽기 영역처럼 보여주고 기본 들여쓰기를 없앤다. */
export const list = style({ listStyle: 'none', padding: 0, margin: 0 });

/** 선택한 학습 항목을 색과 테두리로 구분한다. */
export const listItem = style({
  display: 'block',
  width: '100%',
  padding: '20px 18px',
  border: 0,
  borderBottom: `1px solid ${vars.color.line}`,
  background: vars.color.surface,
  color: vars.color.ink,
  textAlign: 'left',
  borderRadius: vars.radius.control,
  cursor: 'pointer',
  selectors: {
    '&[aria-pressed="true"]': { background: vars.color.selected },
    '&:hover': { background: vars.color.canvas },
  },
});

/** 표현과 질문 제목의 링크는 주요 색상을 사용한다. */
export const link = style({
  color: vars.color.accent,
  textDecoration: 'none',
  fontWeight: 500,
});

/** 출처와 등록일을 본문보다 작은 크기로 표시한다. */
export const meta = style({
  color: vars.color.muted,
  fontSize: 12,
  lineHeight: 1.6,
});

/** 긴 원문을 발췌 영역 안에서 읽을 수 있게 한다. */
export const quote = style({
  margin: '16px 0',
  padding: '16px 18px',
  borderRadius: vars.radius.control,
  background: vars.color.notice,
  color: vars.color.ink,
  fontSize: 15,
  lineHeight: 1.8,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
});

/** 여러 줄로 작성한 메모와 대화를 그대로 표시한다. */
export const prose = style({
  lineHeight: 1.85,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
  marginBlock: '12px 20px',
});

/** 요청 실패를 입력 안내와 구분한다. */
export const error = style({
  padding: '12px 16px',
  color: vars.color.error,
  background: vars.color.errorBackground,
  borderRadius: vars.radius.control,
  fontSize: 14,
  lineHeight: 1.6,
});

/** 저장 결과를 대화 흐름을 가리지 않고 알린다. */
export const notice = style({
  padding: '12px 16px',
  color: vars.color.muted,
  background: vars.color.canvas,
  borderRadius: vars.radius.control,
  fontSize: 13,
  lineHeight: 1.7,
});

/** 확인 단계의 원문과 공개 대상을 묶는다. */
export const preview = style({
  padding: vars.space.md,
  border: `1px solid ${vars.color.line}`,
  borderRadius: vars.radius.panel,
  background: vars.color.canvas,
});

/** 대화 사이의 변경 지점을 가는 선으로 구분한다. */
export const message = style({
  paddingBlock: vars.space.lg,
  borderBottom: `1px solid ${vars.color.line}`,
});

/** 발신자와 게시 시각을 같은 기준선에 둔다. */
export const author = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  marginBottom: vars.space.sm,
});

/** 출처 내용을 카드와 혼동하지 않게 단순한 표로 정렬한다. */
export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 14,
});

/** 자료의 유형을 원문과 연결되는 작은 표지로 표시한다. */
export const cover = style({
  width: 52,
  height: 66,
  borderRadius: 5,
  border: `1px solid ${vars.color.line}`,
  color: vars.color.accent,
  background: vars.color.canvas,
  display: 'grid',
  placeItems: 'center',
  flexShrink: 0,
});

/** 목록 상단의 분류는 밑줄로 선택 상태를 전달한다. */
export const tabs = style({
  display: 'flex',
  gap: vars.space.lg,
  borderBottom: `1px solid ${vars.color.line}`,
  marginBottom: vars.space.lg,
});

/** 분류 버튼은 선택한 상태를 색과 밑줄로 함께 드러낸다. */
export const tab = style({
  padding: '12px 6px',
  border: 0,
  borderBottom: '2px solid transparent',
  background: 'transparent',
  color: vars.color.muted,
  cursor: 'pointer',
  fontSize: 14,
  selectors: {
    '&[aria-pressed="true"]': {
      color: vars.color.accent,
      borderBottomColor: vars.color.accent,
    },
  },
});

globalStyle(`${table} th, ${table} td`, {
  padding: '18px 14px',
  borderBottom: `1px solid ${vars.color.line}`,
  textAlign: 'left',
  verticalAlign: 'middle',
});

globalStyle(`${table} th`, {
  color: vars.color.muted,
  fontSize: 12,
  fontWeight: 500,
});

globalStyle(`${heading} h1`, { margin: 0, fontSize: 26, lineHeight: 1.4 });

globalStyle(`${panel} h2, ${sourcePanel} h2`, {
  fontSize: 18,
  margin: '0 0 16px',
});

globalStyle(`${field} textarea`, { minHeight: 112 });
