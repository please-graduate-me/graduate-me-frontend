import { defineTheme } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';

/** neutral 기본 외형 위에 PGM 브랜드의 청록 강조색, 흰 바탕과 둥근 모서리를 얹는다. */
export const pgmTheme = defineTheme({
  name: 'pgm',
  extends: neutralTheme,
  // color 자동 생성은 바탕까지 청록으로 물들이므로 강조색 관련 토큰만 직접 지정한다.
  tokens: {
    '--color-accent': ['#0B7A62', '#3CC79F'],
    '--color-on-accent': ['#FFFFFF', '#00382A'],
    '--color-accent-muted': ['#E3F4EE', '#12352C'],
    '--color-text-accent': ['#0B7A62', '#3CC79F'],
    '--color-icon-accent': ['#0B7A62', '#3CC79F'],
    '--color-background-body': ['#FFFFFF', '#1B1B1B'],
    '--color-text-primary': ['#16181D', '#FFFFFF'],
  },
  radius: { base: 4, multiplier: 1.5 },
  components: {
    button: {
      base: { borderRadius: 'var(--radius-full)' },
      // 시안의 검은 알약 버튼으로, 청록 primary 다음 위계의 주요 행동에 쓴다.
      'variant:ink': { backgroundColor: '#16181D', color: '#FFFFFF' },
    },
  },
});
