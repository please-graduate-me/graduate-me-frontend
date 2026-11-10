import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 개인 뜻과 메모는 원문 발췌와 구분한 조용한 읽기 영역에 둔다. */
export const detail = style({
  background: '#fbfcfe',
  borderRadius: vars.radius.panel,
  padding: 26,
  minWidth: 0,
});

/** 표현 자체를 문서 제목보다 낮고 본문보다 높은 위계로 표시한다. */
export const title = style({
  fontSize: 28,
  fontWeight: 500,
  lineHeight: '40px',
  overflowWrap: 'anywhere',
  marginBlock: '18px',
});
