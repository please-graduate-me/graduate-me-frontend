import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 계정 정보가 인증 버튼과 붙지 않도록 간격을 유지한다. */
export const account = style([{ marginRight: '12px', fontSize: '14px' }]);

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

/** 영역의 성격을 제목보다 낮은 위계로 전달한다. */
export const eyebrow = style([
  {
    color: vars.color.accent,
    fontWeight: '700',
    fontSize: '13px',
    marginBottom: '10px',
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

/** 좁은 화면에서도 소개와 계정 영역이 겹치지 않게 한다. */
export const pageHeading = style([
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '20px',
  },
  { alignItems: 'flex-start' },
  {
    '@media': {
      '(max-width: 800px)': {
        alignItems: 'flex-start',
        flexDirection: 'column',
      },
    },
  },
]);

/** 부가 정보가 본문과 같은 강조 수준을 갖지 않게 한다. */
export const small = style([{ fontSize: '13px' }]);

globalStyle(`.${notice} p:last-child`, { marginBottom: '0' });
