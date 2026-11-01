import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';
/** 실패 메시지를 일반 안내와 시각적으로 구분한다. */
export const error = style([
  {
    padding: '14px 16px',
    borderRadius: '7px',
    margin: '16px 0',
    background: vars.color.notice,
  },
  {
    color: vars.color.error,
    background: vars.color.errorBackground,
  },
]);
