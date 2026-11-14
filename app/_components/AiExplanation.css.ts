import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 구절 패널의 설명은 카드 안에서 읽기 순서대로 배치한다. */
export const root = style({
  display: 'grid',
  gap: vars.space.md,
  overflowWrap: 'anywhere',
});

/** 긴 발췌 제목이 패널 밖으로 나가지 않게 한다. */
export const title = style({ margin: 0, overflowWrap: 'anywhere' });

/** AI 추가 예문은 별도 카드 안에서 간격을 유지한다. */
export const examples = style({ display: 'grid', gap: vars.space.sm });
