import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 원문에 연결된 개인 표현은 저장 이후에도 같은 탭에서 확인한다. */
export const records = style({ display: 'grid', gap: 20, marginBottom: 20 });

/** 서로 다른 뜻과 기록을 구분해 원문 버전 링크와 함께 보여 준다. */
export const savedRecord = style({
  display: 'grid',
  justifyItems: 'start',
  gap: 16,
  fontSize: 14,
  lineHeight: '22px',
  overflowWrap: 'anywhere',
});

/** 저장 완료 안내는 현재 원문과 연결된 실제 표현에만 표시한다. */
export const savedNotice = style({
  padding: 12,
  width: '100%',
  borderRadius: 7,
  background: vars.color.success,
  color: vars.color.match,
  fontSize: 12,
});

globalStyle(`${savedRecord} h3`, {
  fontSize: 24,
  fontWeight: 500,
  lineHeight: '34px',
  margin: 0,
});

globalStyle(`${savedRecord} p`, { margin: 0, whiteSpace: 'pre-wrap' });
globalStyle(`${savedRecord} > a`, { fontSize: 12 });

/** 목록 조회 실패를 저장 결과와 구분해 안내한다. */
export const description = style({
  fontSize: 14,
  color: vars.color.muted,
  lineHeight: 1.8,
});
