import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import architecture from './rules/architecture.mjs';

/** 도구 설정을 한 진입점에서 적용해 실행 환경의 차이를 줄인다. */
export default defineConfig([
  globalIgnores(['.agents/**']),
  ...nextVitals,
  ...nextTypeScript,
  prettier,
  {
    plugins: { '@stylistic': stylistic },
    rules: {
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'export' },
        { blankLine: 'always', prev: 'export', next: '*' },
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['singleline-const', 'singleline-let', 'singleline-var'],
          next: ['singleline-const', 'singleline-let', 'singleline-var'],
        },
        {
          blankLine: 'always',
          prev: '*',
          next: [
            'multiline-const',
            'multiline-let',
            'multiline-var',
            'multiline-expression',
            'block-like',
            'return',
          ],
        },
        {
          blankLine: 'always',
          prev: ['multiline-expression', 'block-like'],
          next: '*',
        },
      ],
    },
  },
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
