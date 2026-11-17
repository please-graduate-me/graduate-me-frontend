import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 조교 답변 카드 안 요소를 읽는 순서대로 쌓는다. */
export const answer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  minWidth: 0,
});

/** 조교 이름, 표식과 작성 시각을 한 줄에 둔다. */
export const answerHeader = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.sm,
  fontSize: 15,
  fontWeight: 800,
});

/** 작성 시각은 이름 줄 오른쪽 끝에 낮은 위계로 둔다. */
export const answerTime = style({
  marginLeft: 'auto',
  fontSize: vars.fontSize.caption,
  fontWeight: 700,
  color: '#33574C',
});

/** 조교 답변 본문은 청록 바탕과 대비되는 짙은 색으로 읽힌다. */
export const answerBody = style({
  margin: 0,
  fontSize: 15,
  lineHeight: 1.75,
  color: '#1F3A33',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
});

/** 일반 댓글은 카드 없이 아바타 옆에 내용을 둔다. */
export const comment = style({
  display: 'flex',
  gap: vars.space.compact,
  paddingBlock: vars.space.xxs,
  minWidth: 0,
});

/** 긴 댓글이 아바타 열을 밀지 않게 남은 폭을 차지한다. */
export const commentContent = style({
  flex: '1 1 auto',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: vars.space.xxs,
});

/** 작성자 이름과 시각을 한 줄에 둔다. */
export const commentHeader = style({
  margin: 0,
  fontSize: vars.fontSize.small,
  fontWeight: 800,
});

/** 시각은 이름보다 낮은 위계로 붙인다. */
export const commentTime = style({
  fontSize: vars.fontSize.caption,
  fontWeight: 600,
  color: vars.color.muted,
});

/** 댓글 본문은 줄바꿈을 그대로 살려 읽힌다. */
export const commentBody = style({
  margin: 0,
  fontSize: 15,
  lineHeight: 1.7,
  color: '#33363F',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
});

/** 아바타가 줄어들지 않게 고정한다. */
export const avatar = style({ flex: '0 0 auto', display: 'inline-flex' });

/** 삭제 동작은 내용 아래 오른쪽 끝에 둔다. */
export const remove = style({ alignSelf: 'flex-end' });
