import { defineConfig } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import architecture from './eslint-rules.mjs';

/** 도구 설정을 한 진입점에서 적용해 실행 환경의 차이를 줄인다. */
export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  prettier,
  {
    files: [
      'app/**/*.{ts,tsx}',
      'domains/**/*.{ts,tsx}',
      'components/**/*.{ts,tsx}',
      'lib/**/*.{ts,tsx}',
    ],
    plugins: { architecture },
    rules: { 'architecture/boundaries': 'error' },
  },
  {
    files: ['**/*.tsx'],
    ignores: ['**/*.test.tsx'],
    plugins: { architecture },
    rules: { 'architecture/components': 'error' },
  },
]);
