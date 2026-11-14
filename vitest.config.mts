import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vitest/config';

// 빌드 플러그인 없이도 컴포넌트 스타일 모듈을 불러올 수 있게 파일 범위만 지정한다.
const styleFileScope: Plugin = {
  name: 'vanilla-extract-file-scope',
  transform(code, id) {
    if (!/\.css\.ts$/.test(id)) return;

    return [
      `import { setFileScope, endFileScope } from '@vanilla-extract/css/fileScope';`,
      `setFileScope(${JSON.stringify(id)}, 'frontend');`,
      code,
      'endFileScope();',
    ].join('\n');
  },
};

/** 담당 앱의 테스트만 독립적으로 실행한다. */
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [styleFileScope],
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  test: {
    name: 'frontend',
    environment: 'node',
    include: ['**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
  },
});
