import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const reactPackage = require.resolve('@rive-app/react-canvas/package.json');
const runtimeRequire = createRequire(reactPackage);
const packagePath = runtimeRequire.resolve('@rive-app/canvas/package.json');
const runtimeDirectory = dirname(packagePath);
const { version } = JSON.parse(readFileSync(packagePath, 'utf8'));

const destination = fileURLToPath(
  new URL(`../../public/rive/${version}/`, import.meta.url)
);

// 경로의 버전과 코드의 로더 설정이 어긋나면 배포 전에 중단한다.
if (version !== '2.50.0') {
  throw new Error(
    'Rive 런타임 변경 시 AnimatedBoo의 WASM 경로도 갱신해야 합니다.'
  );
}

mkdirSync(destination, { recursive: true });

for (const name of ['rive.wasm', 'rive_fallback.wasm']) {
  copyFileSync(join(runtimeDirectory, name), join(destination, name));
}

process.stdout.write(`Rive ${version} WASM 복사 완료\n`);
