import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';
/** 영상과 구절의 공유 행동을 각각 가까운 위치에 묶는다. */
export const container = style({ margin: '12px 0' });
/** 긴 링크를 모바일 화면 안에서 선택하게 한다. */
export const link = style({
  width: '100%',
  marginTop: '8px',
  fontSize: '13px',
});
/** 복사 결과를 학습 피드백보다 낮은 위계로 표시한다. */
export const message = style({
  fontSize: '13px',
  color: vars.color.muted,
  margin: '8px 0',
});
