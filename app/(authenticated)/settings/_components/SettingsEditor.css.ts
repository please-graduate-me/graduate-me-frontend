import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 저장 중의 옵션 잠금을 한 그룹으로 관리한다. */
export const options = style({
  border: 0,
  padding: 0,
  margin: '24px 0 0',
  minWidth: 0,
});

/** 설정 이름과 실제 값을 같은 기준선에 정렬한다. */
export const row = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 32,
  padding: '20px 0',
  borderBottom: '1px solid ' + vars.color.line,
  selectors: { '&:first-child': { borderTop: '1px solid ' + vars.color.line } },
});

/** 항목 이름을 선택값과 구별한다. */
export const name = style({ fontSize: vars.fontSize.small, fontWeight: 500 });

globalStyle('.' + row + ' select', { width: 176, flex: 'none' });

/** 자동 반복과 일시정지의 의미를 실제 조작부 아래에 설명한다. */
export const note = style({
  fontSize: vars.fontSize.caption,
  color: vars.color.muted,
  margin: '18px 0 0',
});

/** 저장 여부를 훅의 실제 상태로 전달한다. */
export const status = style({
  fontSize: vars.fontSize.caption,
  color: vars.color.muted,
  margin: '20px 0 0',
  selectors: {
    '&::before': {
      content: '""',
      display: 'inline-block',
      width: 6,
      height: 6,
      background: vars.color.match,
      borderRadius: '50%',
      marginRight: 8,
    },
    '&[data-state="saving"]::before': { background: vars.color.muted },
    '&[data-state="error"]': { color: vars.color.error },
    '&[data-state="error"]::before': { background: vars.color.error },
  },
});
