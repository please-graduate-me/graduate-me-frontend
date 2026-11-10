import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 구절 패널에서는 설명의 내용과 검토 상태를 먼저 읽게 한다. */
export const root = style({
  display: 'grid',
  gap: 20,
  fontSize: 14,
  lineHeight: '22px',
  overflowWrap: 'anywhere',
});

/** 긴 발췌도 원문 패널의 폭 안에서 줄바꿈한다. */
export const title = style({
  fontSize: 28,
  lineHeight: '40px',
  fontWeight: 500,
  margin: 0,
});

/** 설명 종류는 실제 내용보다 낮은 위계로 표시한다. */
export const label = style({
  color: vars.color.muted,
  fontSize: 12,
  lineHeight: '18px',
});

/** AI 추가 예문을 원문 인용과 다른 바탕으로 구분한다. */
export const examples = style({
  padding: 14,
  borderRadius: 8,
  background: vars.color.canvas,
});

globalStyle(`${root} p`, { margin: '6px 0 0', whiteSpace: 'pre-wrap' });

globalStyle(`${root} summary`, {
  cursor: 'pointer',
  color: vars.color.muted,
  fontSize: 12,
});
