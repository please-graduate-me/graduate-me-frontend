import { style, globalStyle } from '@vanilla-extract/css';
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

/** 보조 설명이 주요 행동보다 먼저 눈에 띄지 않게 한다. */
export const muted = style([{ color: vars.color.muted }]);

/** 학습 흐름을 끊지 않고 확인할 안내를 강조한다. */
export const notice = style([
  {
    padding: '14px 16px',
    borderRadius: '7px',
    margin: '16px 0',
    background: vars.color.notice,
  },
]);

/** 영상 준비 상태를 목록으로 돌아가는 링크와 분리한다. */
export const processing = style([{ marginTop: '24px' }]);

globalStyle(`.${notice} p:last-child`, { marginBottom: '0' });

globalStyle(`.${processing} h1`, { fontSize: '25px', letterSpacing: '-.5px' });
