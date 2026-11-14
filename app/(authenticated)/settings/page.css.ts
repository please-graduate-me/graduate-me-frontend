import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 계정과 학습 설정을 여유 있는 데스크톱 읽기 폭에 배치한다. */
export const page = style({ maxWidth: 920 });

/** 설정 목적을 제목 가까이에 표시한다. */
export const intro = style({ marginBottom: 32 });

/** 실제 계정 정보와 로그아웃을 한 영역에서 확인하게 한다. */
export const account = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 24,
  margin: '0 0 32px',
});

globalStyle('.' + account + ' strong', { fontSize: vars.fontSize.small });

/** 계정 상태와 종료 행동의 간격을 일정하게 유지한다. */
export const accountActions = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 16,
});

/** 학습 옵션의 전체 범위를 하나의 설정 영역으로 묶는다. */
export const learning = style({
  margin: '0 0 32px',
});

/** 도우미와 운영자의 작업이 학생 학습 설정과 다름을 안내한다. */
export const workplace = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 24,
});
