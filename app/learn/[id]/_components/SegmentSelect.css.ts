import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 완료 화면에서도 같은 위치에서 구절 이동을 찾게 한다. */
export const container = style({ marginBottom: '20px' });
/** 좁은 화면에서는 선택 메뉴가 다음 줄로 흐르게 한다. */
export const label = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '10px',
});
/** 긴 선택 문구가 모바일 화면을 넘지 않게 한다. */
export const select = style({ maxWidth: '100%', minWidth: 0 });
/** 이동 동작의 설명을 선택 메뉴보다 낮은 위계로 표시한다. */
export const description = style({
  color: vars.color.muted,
  fontSize: '13px',
  marginTop: '8px',
});
