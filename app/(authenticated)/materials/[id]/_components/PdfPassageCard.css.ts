import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 선택한 발췌는 따뜻한 종이색 카드에 담아 전체 자료와 구분한다. */
export const root = style({
  display: 'grid',
  gap: vars.space.xs,
  padding: vars.space.md,
  borderRadius: 16,
  border: `1px solid ${vars.color.quoteLine}`,
  background: vars.color.quote,
  color: vars.color.ink,
});

/** 원문 위치는 발췌보다 낮은 위계로 위에 둔다. */
export const meta = style({ fontSize: 12 });

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

/** 번역은 원문 바로 아래 보조 글자로 이어 읽게 한다. */
export const translation = style({
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
});

/** 번역 요청 실패는 카드 안에서 원인을 바로 보여 준다. */
export const error = style({ color: vars.color.error });

/** 번역 보기와 문장 듣기를 한 줄에 두고 좁으면 줄바꿈한다. */
export const actions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xs,
  marginTop: vars.space.xxs,
  selectors: { '&:empty': { display: 'none' } },
});
