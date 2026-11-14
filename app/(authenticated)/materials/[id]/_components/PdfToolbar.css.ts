import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 도구 모음의 외형과 키보드 이동은 Astryx에 맡긴다. */
export const toolbar = style({
  position: 'relative',
  minHeight: 56,
  zIndex: 5,
});

/** 이전과 다음 이동 사이에 페이지 입력 폭을 확보한다. */
export const pageControl = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  flexShrink: 0,
});

/** 페이지 입력의 컨테이너 폭만 제한한다. */
export const pageInput = style({ width: 64 });

/** 전체 페이지 수는 조작부와 함께 줄바꿈하지 않는다. */
export const total = style({ whiteSpace: 'nowrap', color: vars.color.muted });

/** 서로 다른 조작 묶음을 구별하는 보조 선이다. */
export const divider = style({
  width: 1,
  height: 22,
  background: vars.color.line,
});

/** 확대 조작과 배율 선택을 둥근 알약 하나로 묶는다. */
export const zoomControls = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xxs,
  padding: 2,
  border: `1px solid ${vars.color.line}`,
  borderRadius: 999,
});

/** 잘못 입력한 페이지는 도구 모음 아래에 안내한다. */
export const error = style({
  position: 'absolute',
  top: '100%',
  left: 16,
  background: vars.color.errorBackground,
  color: vars.color.error,
  padding: '8px 12px',
  borderRadius: vars.radius.control,
});
