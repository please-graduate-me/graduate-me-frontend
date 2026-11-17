import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 언어 필터, 이어서 학습 카드, 최근 자료 타일 줄을 세로로 쌓는다. */
export const root = style({ display: 'grid', gap: vars.space.comfortable });

/** 언어 필터는 본문 폭을 다 쓰지 않는 보조 조작으로 둔다. */
export const filter = style({ maxWidth: 240 });

/** 최근 자료 타일을 카드 폭 안에서 줄바꿈해 나열한다. */
export const tiles = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.sm,
  maxWidth: 640,
});

/** 최근 자료 타일은 72x60 크기만 정하고 테두리·선택 표시는 공통 버튼에 맡긴다. */
export const tile = style({ width: 72, height: 60, padding: 0 });

/** 데이터를 기다리는 상태를 빈 목록과 구분한다. */
export const loading = style({
  minHeight: 160,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.muted,
  fontSize: vars.fontSize.small,
});
