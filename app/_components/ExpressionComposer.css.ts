import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 삽입 폼의 간격만 조정하고 입력 외형은 Astryx 테마를 따른다. */
export const embedded = style({ gap: vars.space.md });
