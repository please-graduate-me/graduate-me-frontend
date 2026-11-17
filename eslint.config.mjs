import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import hooks from 'eslint-plugin-react-hooks';
import refresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import architecture from './rules/architecture.mjs';

/** React 검사와 공통 포맷 규칙을 서비스 앱에서 독립 실행한다. */
export default defineConfig([
  globalIgnores([
    'dist/**',
    '.next/**',
    'coverage/**',
    'node_modules/**',
    'src/app/routeTree.gen.ts',
  ]),
  { languageOptions: { globals: globals.node } },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { 'react-hooks': hooks, 'react-refresh': refresh },
    rules: {
      ...hooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'error',
        { allowConstantExport: true, allowExportNames: ['iconNames'] },
      ],
    },
  },
  {
    files: ['src/app/routes/**/*.{ts,tsx}'],
    ignores: ['src/app/routes/**/-components/**'],
    rules: {
      // 라우트 모듈의 HMR은 TanStack Router의 Vite 플러그인이 처리한다.
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { architecture },
    rules: { 'architecture/boundaries': 'error' },
  },
  {
    files: ['src/**/*.tsx'],
    ignores: ['**/*.test.tsx', 'src/app/routeTree.gen.ts'],
    plugins: { architecture },
    rules: { 'architecture/components': 'error' },
  },
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
]);
