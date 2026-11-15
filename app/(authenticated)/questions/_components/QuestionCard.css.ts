import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 자료 그림, 제목, 상태와 담당 정보를 한 카드 안에 흘려 배치한다. */
export const card = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: '14px 16px',
});

/** 자료 종류를 알리는 정사각 그림 칸이다. */
export const thumb = style({
  width: 48,
  height: 48,
  flex: '0 0 auto',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 14,
});

/** 영상은 먹색 바탕에 청록 재생 표시, PDF는 보라 바탕에 보라 문서로 구분한다. */
export const thumbKind = styleVariants({
  video: { background: vars.color.ink, color: vars.color.accentBright },
  pdf: { background: vars.color.reviewBackground, color: vars.color.review },
});

/** 질문 제목과 근거 자료 정보가 상태 표지를 제외한 남은 폭을 차지한다. */
export const body = style({
  flex: '1 1 300px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
});

/** 질문 제목은 카드 제목 크기로 둔다. */
export const title = style({ fontSize: 17, lineHeight: 1.45 });

/** 근거 자료 정보는 굵은 보조 글자로 둔다. */
export const source = style({
  margin: 0,
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.muted,
  overflowWrap: 'anywhere',
});

/** 답변 도우미와 최근 활동을 구분선 아래 한 줄에 둔다. */
export const details = style({
  flex: '1 1 100%',
  margin: 0,
  paddingTop: vars.space.compact,
  borderTop: `1px solid ${vars.color.neutral}`,
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px 24px',
  fontSize: vars.fontSize.label,
});

/** 정보 이름과 값을 한 쌍으로 붙인다. */
export const detail = style({ display: 'flex', gap: 6 });

/** 정보 이름은 보조색으로 둔다. */
export const term = style({
  color: vars.color.muted,
  fontWeight: vars.fontWeight.bold,
});

/** 정보 값은 본문색 굵은 글자로 둔다. */
export const value = style({ margin: 0, fontWeight: vars.fontWeight.bold });
