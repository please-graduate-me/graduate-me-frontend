import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 캐릭터와 개인 성장 목표를 작은 화면에서도 나란히 읽을 수 있게 감싼다. */
export const hero = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.xl,
  padding: vars.space.lg,
  borderRadius: vars.radius.panel,
  background: vars.color.selected,
});

/** 진행률을 키보드와 보조 기술이 읽을 수 있는 기본 요소로 표시한다. */
export const progress = style({
  width: 'min(280px, 100%)',
  accentColor: vars.color.accent,
});

/** 긴 닉네임이 모바일 화면 전체를 밀어내지 않게 한다. */
export const tableScroll = style({ overflowX: 'auto' });

/** 순위와 수치의 열 정렬을 유지한다. */
export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
});

globalStyle(`${table} th, ${table} td`, {
  padding: vars.space.md,
  borderBottom: '1px solid ' + vars.color.line,
  overflowWrap: 'anywhere',
});

/** 내 기록을 색상과 별도 문구로 함께 식별한다. */
export const me = style({ background: vars.color.selected });
