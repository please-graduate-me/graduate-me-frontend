import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 저장 중의 옵션 잠금을 한 그룹으로 관리한다. */
export const options = style({
  border: 0,
  padding: 0,
  margin: '4px 0 0',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
});

/** 설정 이름과 실제 값을 같은 기준선에 정렬하고 좁으면 줄바꿈한다. */
export const row = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.compact,
  padding: '14px 0',
  borderTop: '1px solid ' + vars.color.neutral,
});

/** 항목 이름을 선택값보다 굵게 표시한다. */
export const name = style({
  fontSize: 15,
  fontWeight: vars.fontWeight.heavy,
  color: vars.color.ink,
});

/** 자동 미리듣기를 끄면 반복 항목 이름도 함께 흐리게 한다. */
export const off = style({ color: vars.color.subtle });

/** 선택 입력을 오른쪽에 일정한 폭으로 둔다. */
export const control = style({ flex: '0 1 200px', minWidth: 0 });

/** 자동 반복과 일시정지의 의미를 실제 조작부 아래에 설명한다. */
export const note = style({
  fontSize: vars.fontSize.label,
  lineHeight: 1.7,
  color: vars.color.muted,
  margin: '8px 0 0',
});

/** 상태점과 저장 안내의 배치만 정하고 외형은 공통 UI에 맡긴다. */
export const status = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  margin: '14px 0 0',
});
