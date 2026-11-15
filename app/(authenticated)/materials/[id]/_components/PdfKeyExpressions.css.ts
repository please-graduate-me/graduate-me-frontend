import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 제목과 표현 카드 목록을 촘촘한 세로 묶음으로 둔다. */
export const root = style({ display: 'grid', gap: vars.space.sm });

/** 패널 안 소제목은 본문보다 조금 작게 둔다. */
export const heading = style({ fontSize: 14 });

/** 목록 기호 없이 카드만 쌓는다. */
export const list = style({
  display: 'grid',
  gap: vars.space.sm,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

/** 표현 하나와 저장 버튼을 테두리 있는 둥근 카드에 나란히 둔다. */
export const card = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: vars.space.compact,
  padding: 14,
  border: `1px solid ${vars.color.line}`,
  borderRadius: 14,
});

/** 뜻이 길어도 버튼 자리를 밀지 않게 남은 폭만 쓴다. */
export const text = style({ flex: '1 1 auto', minWidth: 0 });

/** 표현은 숫자 서체와 같은 글꼴로 굵게 먼저 읽히게 한다. */
export const term = style({
  margin: 0,
  fontFamily: vars.font.numeric,
  fontSize: 15,
  fontWeight: vars.fontWeight.bold,
  overflowWrap: 'anywhere',
});

/** 품사는 표현 옆에 작은 보조 글자로 붙인다. */
export const partOfSpeech = style({
  fontFamily: vars.font.body,
  fontSize: 12,
  fontWeight: vars.fontWeight.medium,
  color: vars.color.subtle,
});

/** 책갈피는 카드 오른쪽 위에 고정해 줄지 않게 한다. */
export const bookmark = style({ flexShrink: 0, color: vars.color.accent });

/** 저장 실패는 목록 위에서 원인을 보여 준다. */
export const error = style({ color: vars.color.error });
