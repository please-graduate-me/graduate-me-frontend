import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 구절 패널 안의 저장 폼은 원문을 가리지 않는 밀도를 사용한다. */
export const embedded = style({ gap: 20 });

globalStyle(`${embedded} > label`, {
  color: vars.color.muted,
  fontSize: 12,
  fontWeight: 400,
});

globalStyle(`${embedded} textarea`, { minHeight: 108 });
