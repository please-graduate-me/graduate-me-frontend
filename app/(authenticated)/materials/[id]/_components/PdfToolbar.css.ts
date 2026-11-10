import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 원문 읽기 도구를 작은 실제 컨트롤로 정렬한다. */
export const toolbar = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  height: 52,
  paddingInline: vars.space.md,
  borderBottom: `1px solid ${vars.color.line}`,
  background: vars.color.surface,
  zIndex: 5,
});

/** 페이지 이동과 입력을 하나의 조작 단위로 묶는다. */
export const pageControl = style({
  display: 'flex',
  width: 190,
  height: 40,
  justifyContent: 'center',
  flexShrink: 0,
  alignItems: 'center',
  gap: vars.space.xs,
});

/** 짧은 페이지 번호만 입력하는 실제 필드다. */
export const pageInput = style({
  width: 36,
  height: 32,
  textAlign: 'center',
  borderRadius: vars.radius.control,
  border: `1px solid ${vars.color.inputBorder}`,
  color: vars.color.ink,
  background: vars.color.surface,
  fontSize: 14,
  selectors: { '&[aria-invalid="true"]': { borderColor: vars.color.error } },
});

/** 전체 페이지 수와 모드를 보조 정보로 표시한다. */
export const total = style({
  fontSize: 12,
  color: vars.color.muted,
  whiteSpace: 'nowrap',
});

/** 서로 다른 도구 묶음을 가는 선으로 나눈다. */
export const divider = style({
  width: 1,
  height: 22,
  background: vars.color.line,
});

/** 확대 메뉴를 트리거 바로 아래에 배치한다. */
export const zoomRoot = style({ position: 'relative' });

/** 확대율이 숫자와 맞춤 모드를 모두 표시하게 한다. */
export const zoomButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
  padding: '6px 10px',
  minWidth: 94,
  height: 32,
  border: 0,
  borderRadius: vars.radius.control,
  background: 'transparent',
  selectors: { '&[aria-expanded="true"]': { background: vars.color.selected } },
  color: vars.color.ink,
  fontSize: 13,
  cursor: 'pointer',
});

/** 확대 옵션은 원문 위에 떠 있는 독립 메뉴로 표시한다. */
export const menu = style({
  position: 'absolute',
  top: 42,
  left: 0,
  width: 238,
  padding: vars.space.xs,
  borderRadius: vars.radius.panel,
  border: `1px solid ${vars.color.line}`,
  boxShadow: '0 8px 24px rgb(36 49 75 / 14%)',
  background: vars.color.surface,
  zIndex: 10,
});

/** 메뉴는 선택 상태를 체크 표시와 배경으로 함께 전달한다. */
export const menuItem = style({
  width: '100%',
  height: 38,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '6px 10px',
  background: vars.color.surface,
  color: vars.color.ink,
  border: 0,
  borderRadius: vars.radius.control,
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: 14,
  selectors: {
    '&[aria-pressed="true"]': {
      background: vars.color.selected,
      color: vars.color.accent,
    },
    '&:hover': { background: vars.color.canvas },
  },
});

/** 개인 메모 조작은 도구 모음 오른쪽에 둔다. */
export const spacer = style({ flex: 1 });

/** 잘못된 페이지 입력은 입력 근처에 표시한다. */
export const error = style({
  position: 'absolute',
  left: 44,
  top: 52,
  padding: '6px 10px',
  border: `1px solid ${vars.color.line}`,
  borderRadius: vars.radius.control,
  background: vars.color.surface,
  color: vars.color.error,
  fontSize: 12,
});

/** 확대·축소·배율 선택을 하나의 조작 영역으로 묶는다. */
export const zoomControls = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 2,
  width: 200,
  flexShrink: 0,
});
