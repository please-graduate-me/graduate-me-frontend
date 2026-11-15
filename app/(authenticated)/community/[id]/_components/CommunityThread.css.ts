import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 본문 열과 관련 학습 열을 나란히 두고 좁은 화면에서는 아래로 내린다. */
export const layout = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: 40,
  minWidth: 0,
});

/** 같은 구절 질문과 표현 저장 카드를 본문 제목 높이에 맞춰 쌓는다. */
export const aside = style({
  flex: '1 1 260px',
  maxWidth: 320,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  paddingTop: 72,
  '@media': { '(max-width: 900px)': { maxWidth: 'none', paddingTop: 0 } },
});

/** 글 본문을 읽기 좋은 폭으로 제한하고 요소를 읽는 순서대로 쌓는다. */
export const root = style({
  flex: '999 1 560px',
  maxWidth: 760,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 22,
});

/** 목록으로 돌아가는 링크가 행 전체로 늘어나지 않게 한다. */
export const back = style({ alignSelf: 'flex-start' });

/** 글 종류와 언어 배지를 한 줄에 둔다. */
export const badges = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginBottom: -8,
});

/** 작성자 정보와 팔로우 동작을 한 줄 양 끝에 둔다. */
export const author = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.compact,
});

/** 아바타가 줄어들지 않게 고정한다. */
export const avatar = style({ flex: '0 0 auto', display: 'inline-flex' });

/** 이름과 작성 시각이 팔로우 버튼을 제외한 남은 폭을 차지한다. */
export const authorInfo = style({ flex: '1 1 auto', minWidth: 0 });

/** 작성자 이름과 조교 배지를 한 줄에 둔다. */
export const authorName = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 6,
  margin: 0,
  fontSize: 15,
  fontWeight: 800,
});

/** 작성 시각은 이름보다 낮은 위계로 둔다. */
export const authorMeta = style({
  margin: 0,
  fontSize: vars.fontSize.caption,
  color: vars.color.muted,
});

/** 공유 원문은 따뜻한 바탕의 인용 패널로 질문 본문과 구분한다. */
export const excerpt = style({
  margin: 0,
  padding: vars.space.comfortable,
  borderRadius: 18,
  background: '#FFF8EE',
  border: '1px solid #FBE3C2',
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
});

/** 발췌 표식과 자료 위치를 인용 위에 작게 둔다. */
export const excerptCaption = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
  fontSize: vars.fontSize.caption,
  fontWeight: 800,
  color: '#9A3F06',
});

/** 자료 제목과 위치는 표식보다 낮은 위계의 회색으로 둔다. */
export const excerptSource = style({
  fontWeight: 700,
  color: vars.color.muted,
});

/** 원문 문장은 본문 서체로 크게 보여 질문의 대상을 먼저 읽게 한다. */
export const excerptQuote = style({
  margin: 0,
  fontFamily: vars.font.document,
  fontSize: 20,
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

/** 원문 이동 링크는 발췌 표식과 같은 주황 계열로 묶는다. */
export const excerptLink = style({
  alignSelf: 'flex-start',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  minHeight: 40,
  fontSize: 13,
  fontWeight: 800,
  color: '#9A3F06',
  textDecoration: 'none',
});

/** 접근 권한 안내는 링크 아래 작은 회색 글자로 둔다. */
export const excerptNote = style({
  margin: 0,
  fontSize: vars.fontSize.caption,
  color: vars.color.muted,
});

/** 질문 본문은 넉넉한 줄 간격으로 줄바꿈을 그대로 살린다. */
export const body = style({
  margin: 0,
  fontSize: vars.fontSize.body,
  lineHeight: 1.8,
  color: '#33363F',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
});

/** 태그된 조교와 글 동작을 한 줄에 두고 동작은 오른쪽으로 민다. */
export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.sm,
});

/** 태그된 조교는 테두리만 있는 알약 표시로 구분한다. */
export const tag = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 12px',
  borderRadius: 999,
  border: `1px solid ${vars.color.line}`,
  fontSize: 13,
  fontWeight: 700,
  color: '#33363F',
});

/** 태그 표시와 글 동작 사이의 남은 공간을 채운다. */
export const spacer = style({ flex: '1 1 auto' });

/** 구분선 아래 댓글 제목, 답변과 입력을 일정한 간격으로 쌓는다. */
export const comments = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  paddingTop: 22,
});

/** 댓글 입력은 테두리 상자로 묶어 목록과 구분한다. */
export const composer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  padding: vars.space.md,
  border: `1px solid ${vars.color.line}`,
  borderRadius: 18,
});

/** 게시 버튼은 입력 상자 오른쪽 아래에 둔다. */
export const submit = style({ alignSelf: 'flex-end' });
