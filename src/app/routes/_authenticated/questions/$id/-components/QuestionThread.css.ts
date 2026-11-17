import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 질문 본문 열과 근거 열을 나란히 두고 좁은 화면에서는 위아래로 쌓는다. */
export const root = style({
  maxWidth: 1120,
  marginInline: 'auto',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: vars.space.xxl,
  minWidth: 0,
});

/** 질문과 대화는 읽기 좋은 폭으로 제한하고 읽는 순서대로 쌓는다. */
export const article = style({
  flex: '999 1 560px',
  maxWidth: 760,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 22,
});

/** 목록으로 돌아가는 링크가 행 전체로 늘어나지 않게 한다. */
export const back = style({ alignSelf: 'flex-start' });

/** 답변 상태와 언어 표지를 한 줄에 둔다. */
export const badges = style({ display: 'flex', flexWrap: 'wrap', gap: 8 });

/** 제목과 근거 정보를 표지 가까이 붙인다. */
export const titleBlock = style({ marginTop: -8 });

/** 질문 제목은 상세 화면에 맞춰 조금 작게 둔다. */
export const title = style({ fontSize: 28, lineHeight: 1.4 });

/** 근거 자료 정보는 굵은 보조 글자로 둔다. */
export const meta = style({
  margin: '6px 0 0',
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.muted,
});

/** 해결·공유 상태와 바꾸는 동작을 회색 둥근 막대 하나로 묶는다. */
export const states = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
  padding: 14,
  borderRadius: vars.radius.panel,
  background: vars.color.canvas,
});

/** 상태 표지와 동작 사이를 벌린다. */
export const spacer = style({ flex: '1 1 auto' });

/** 작성자와 시각을 한 줄 양 끝에 둔다. */
export const author = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.sm,
});

/** 아바타가 줄어들지 않게 고정한다. */
export const avatar = style({ flex: '0 0 auto', display: 'inline-flex' });

/** 작성자 이름이다. */
export const name = style({ fontSize: 15, fontWeight: vars.fontWeight.heavy });

/** 작성 시각은 오른쪽 끝에 낮은 위계로 붙인다. */
export const time = style({
  marginLeft: 'auto',
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.subtle,
});

/** 질문 본문 카드 안 요소를 세로로 쌓는다. */
export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

/** 질문과 대화 본문은 줄바꿈을 그대로 살려 넉넉한 줄 간격으로 읽게 한다. */
export const body = style({
  margin: 0,
  fontSize: vars.fontSize.body,
  lineHeight: 1.8,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
});

/** 공유한 AI 결과는 왼쪽 보라 띠로 질문 본문과 구분한다. */
export const attachment = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: '18px 20px',
  borderRadius: vars.radius.panel,
  borderLeft: `4px solid ${vars.color.review}`,
  background: vars.color.canvas,
});

/** 공유한 AI 결과 제목은 보라 작은 글자로 둔다. */
export const attachmentTitle = style({
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.heavy,
  color: vars.color.review,
});

/** 공유한 AI 결과 본문이다. */
export const attachmentBody = style({
  margin: 0,
  fontSize: 15,
  lineHeight: 1.75,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
});

/** 답변과 추가 질문은 구분선 아래 같은 간격으로 쌓는다. */
export const thread = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  paddingTop: 22,
  borderTop: `1px solid ${vars.color.line}`,
});

/** 대화 섹션 제목 크기다. */
export const threadTitle = style({ fontSize: vars.fontSize.heading3 });

/** 도우미 답변 카드 안 요소를 세로로 쌓는다. */
export const answer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

/** 추가 질문은 카드 없이 아바타와 말풍선 글로 가볍게 둔다. */
export const followUp = style({
  display: 'flex',
  gap: vars.space.compact,
  padding: '4px 0',
});

/** 추가 질문 글이 아바타를 제외한 남은 폭을 차지한다. */
export const followUpBody = style({ flex: '1 1 auto', minWidth: 0 });

/** 추가 질문 작성자와 시각 줄이다. */
export const followUpMeta = style({
  margin: 0,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.heavy,
});

/** 추가 질문 시각은 이름보다 낮은 위계로 둔다. */
export const followUpTime = style({
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.medium,
  color: vars.color.subtle,
});

/** 추가 질문 본문은 이름 아래 조금 띄운다. */
export const followUpText = style({
  margin: '4px 0 0',
  fontSize: 15,
  lineHeight: 1.7,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
});

/** 새로 확인 버튼이 행 전체로 늘어나지 않게 한다. */
export const refresh = style({ alignSelf: 'flex-start' });

/** 추가 질문 입력과 보내기를 세로로 쌓는다. */
export const composer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

/** 보내기 버튼은 입력 아래 오른쪽 끝에 둔다. */
export const send = style({ alignSelf: 'flex-end' });

/** 근거 열은 고정 폭으로 두고 넓은 화면에서는 제목 높이만큼 내려 본문과 맞춘다. */
export const aside = style({
  flex: '1 1 280px',
  maxWidth: 340,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  '@media': {
    '(min-width: 960px)': { paddingTop: 72 },
    '(max-width: 959px)': { maxWidth: 'none' },
  },
});

/** 질문의 근거는 따뜻한 바탕 카드로 대화와 구분한다. */
export const source = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.compact,
  padding: vars.space.comfortable,
  borderRadius: vars.radius.card,
  border: `1px solid ${vars.color.quoteLine}`,
  background: vars.color.quote,
});

/** 근거 카드 머리글이다. */
export const sourceLabel = style({
  margin: 0,
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.heavy,
  color: vars.color.warning,
});

/** 영상 근거는 먹색 화면 그림으로, PDF 근거는 문서 아이콘 칸으로 보여 준다. */
export const preview = style({
  position: 'relative',
  height: 148,
  borderRadius: 14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

/** 영상 근거 화면의 먹색 바탕과 청록 재생 표시다. */
export const previewVideo = style({
  background: vars.color.video,
  color: vars.color.accentBright,
});

/** 영상 근거의 재생 시작 시각을 오른쪽 아래 반투명 칩으로 둔다. */
export const previewTime = style({
  position: 'absolute',
  right: 10,
  bottom: 10,
  padding: '2px 8px',
  borderRadius: 6,
  background: 'rgba(255, 255, 255, 0.14)',
  color: '#FFFFFF',
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.caption,
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
});

/** PDF 근거 화면의 보라 바탕과 문서 표시다. */
export const previewPdf = style({
  background: vars.color.reviewBackground,
  color: vars.color.review,
});

/** 근거 자료 제목 크기다. */
export const sourceTitle = style({ fontSize: vars.fontSize.body });

/** 선택한 원문은 문서 서체 인용으로 크게 보여 준다. */
export const quote = style({
  margin: 0,
  fontFamily: vars.font.document,
  fontSize: vars.fontSize.lead,
  fontWeight: 600,
  lineHeight: 1.55,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
  quotes: '"“" "”"',
  selectors: {
    '&::before': { content: 'open-quote' },
    '&::after': { content: 'close-quote' },
  },
});

/** 근거 위치는 낮은 위계로 둔다. */
export const sourceMeta = style({
  margin: 0,
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.subtle,
});

/** 원문 링크는 따뜻한 갈색 글자로 근거 카드에 맞춘다. */
export const sourceLink = style({
  alignSelf: 'flex-start',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  minHeight: 40,
  fontSize: vars.fontSize.label,
  color: vars.color.warning,
  selectors: { '&:hover': { color: vars.color.differenceText } },
});

/** 공개 범위 안내는 자물쇠 아이콘과 함께 회색 상자로 둔다. */
export const privacy = style({
  margin: 0,
  display: 'flex',
  gap: vars.space.sm,
  padding: '14px 16px',
  borderRadius: vars.radius.panel,
  background: vars.color.canvas,
  fontSize: vars.fontSize.label,
  lineHeight: 1.6,
  color: vars.color.ink,
});

/** 공개 범위 안내 아이콘은 첫 줄에 맞춘다. */
export const privacyIcon = style({
  flex: '0 0 auto',
  marginTop: 1,
  color: vars.color.muted,
});
