import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 번역의 문단과 표 줄바꿈을 유지하고 긴 원문도 패널 안에 둔다. */
export const text = style({
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
  lineHeight: 1.8,
});

/** 요약 항목이 원문과 섞이지 않게 읽기 간격을 둔다. */
export const list = style({ paddingInlineStart: 20, lineHeight: 1.8 });

/** 전체 문서 진행률을 패널 너비에 맞춘다. */
export const progress = style({
  width: '100%',
  accentColor: vars.color.accent,
});

/** 어휘의 뜻과 실제 예문을 항목별로 묶는다. */
export const words = style({
  display: 'grid',
  gap: vars.space.lg,
  overflowWrap: 'anywhere',
});

/** 긴 번역은 페이지별로 접어 원본 읽기와 함께 사용할 수 있게 한다. */
export const translation = style({
  paddingBlock: vars.space.md,
  borderBottom: `1px solid ${vars.color.line}`,
});
