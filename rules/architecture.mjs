import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const relative = (file) => path.relative(root, file).split(path.sep).join('/');

function resolveImport(from, specifier) {
  const base = specifier.startsWith('@/')
    ? path.join(root, specifier.slice(2))
    : specifier.startsWith('.')
      ? path.resolve(path.dirname(from), specifier)
      : null;

  if (!base) return null;

  return (
    [
      base,
      `${base}.ts`,
      `${base}.tsx`,
      `${base}/index.ts`,
      `${base}/index.tsx`,
    ].find((file) => fs.existsSync(file) && fs.statSync(file).isFile()) ?? base
  );
}

function domain(file) {
  return relative(file).match(/^domains\/([^/]+)\//)?.[1];
}

function layer(file) {
  const name = relative(file);

  if (name.startsWith('lib/') || name.startsWith('components/ui/')) return 0;
  if (name.startsWith('domains/')) return 1;
  if (name.includes('/_components/')) return 2;
  if (name.startsWith('app/')) return 3;

  return -1;
}

function imports(file) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return [];

  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true
  );

  const result = [];

  function visit(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      if (ts.isImportDeclaration(node) && node.importClause?.isTypeOnly) return;
      if (ts.isExportDeclaration(node) && node.isTypeOnly) return;
      result.push(node.moduleSpecifier.text);
    }

    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      ts.isStringLiteral(node.arguments[0])
    )
      result.push(node.arguments[0].text);
    ts.forEachChild(node, visit);
  }

  visit(source);

  return result;
}

function serverDependency(file, seen = new Set()) {
  if (seen.has(file)) return false;
  seen.add(file);

  return imports(file).some(
    (specifier) =>
      specifier === 'server-only' ||
      specifier === 'next/headers' ||
      (() => {
        const target = resolveImport(file, specifier);

        return target && serverDependency(target, seen);
      })()
  );
}

function hasCycle(start, file = start, seen = new Set()) {
  if (seen.has(file)) return false;
  seen.add(file);

  return imports(file).some((specifier) => {
    const target = resolveImport(file, specifier);

    return (
      target &&
      domain(target) &&
      (target === start || hasCycle(start, target, seen))
    );
  });
}

function returnsJsx(node) {
  if (!node || typeof node !== 'object') return false;
  if (node.type === 'JSXElement' || node.type === 'JSXFragment') return true;
  if (
    [
      'FunctionDeclaration',
      'FunctionExpression',
      'ArrowFunctionExpression',
    ].includes(node.type)
  )
    return false;

  return Object.entries(node).some(
    ([key, value]) =>
      key !== 'parent' &&
      (Array.isArray(value) ? value.some(returnsJsx) : returnsJsx(value))
  );
}

const architecture = {
  rules: {
    boundaries: {
      meta: {
        type: 'problem',
        schema: [],
        messages: { invalid: '{{reason}}' },
      },
      create(context) {
        const file = context.filename;

        const report = (node, reason) =>
          context.report({ node, messageId: 'invalid', data: { reason } });

        function check(node, specifier) {
          if (typeof specifier !== 'string') return;
          const currentLayer = layer(file);

          if (currentLayer < 0) return;
          if (domain(file) && specifier.startsWith('next/'))
            report(node, 'domains는 Next.js에 의존하지 않는다.');
          if (specifier === '@graduate-me/shared' && !domain(file))
            report(node, '공유 업무 계약은 도메인을 통해 사용한다.');
          if (specifier.startsWith('@prisma/'))
            report(node, '프론트엔드에서 DB 패키지를 사용하지 않는다.');
          const target = resolveImport(file, specifier);

          if (!target) return;
          const targetName = relative(target);

          if (targetName.startsWith('../backend/'))
            report(node, '백엔드 구현과 DB 코드를 직접 참조하지 않는다.');
          if (layer(target) > currentLayer)
            report(node, '하위 계층은 상위 계층을 import하지 않는다.');

          if (targetName.includes('/_components/')) {
            const owner = target.slice(
              0,
              target.lastIndexOf(`${path.sep}_components${path.sep}`)
            );

            if (!file.startsWith(owner + path.sep))
              report(
                node,
                '_components는 소유 라우트와 그 하위에서만 사용한다.'
              );
          }

          if (
            relative(file).startsWith('app/') &&
            targetName.startsWith('app/') &&
            specifier.startsWith('@/')
          )
            report(node, 'app 내부에서는 상대 경로를 사용한다.');
          if (
            /^domains\/[^/]+\/ui\//.test(relative(file)) &&
            /^domains\/[^/]+\/api\//.test(targetName)
          )
            report(node, '도메인 UI에서 API를 직접 호출하지 않는다.');
          if (
            domain(file) &&
            domain(target) &&
            domain(file) !== domain(target) &&
            hasCycle(file)
          )
            report(node, '도메인 간 순환 참조를 제거한다.');
          if (
            targetName.endsWith('.css.ts') &&
            !(
              relative(file) === 'app/layout.tsx' &&
              targetName === 'app/globals.css.ts'
            ) &&
            !targetName.startsWith('lib/styles/') &&
            target.replace(/\.css\.ts$/, '') !==
              file.replace(/\.(tsx?|css\.ts)$/, '')
          )
            report(node, '다른 컴포넌트의 내부 스타일을 직접 참조하지 않는다.');
        }

        return {
          ImportDeclaration(node) {
            check(node, node.source.value);
          },
          ExportNamedDeclaration(node) {
            if (node.source) check(node, node.source.value);
          },
          ExportAllDeclaration(node) {
            check(node, node.source.value);
          },
          ImportExpression(node) {
            check(node, node.source.value);
          },
          Program(node) {
            if (
              node.body.some(
                (statement) => statement.directive === 'use client'
              ) &&
              serverDependency(file)
            )
              report(node, 'Client Component가 서버 전용 모듈을 참조한다.');
          },
        };
      },
    },
    components: {
      meta: {
        type: 'problem',
        schema: [],
        messages: { invalid: '{{reason}}' },
      },
      create(context) {
        let count = 0;

        function check(node, name) {
          if (!returnsJsx(node.body)) return;
          count++;
          const filename = path.basename(context.filename, '.tsx');

          const reserved = [
            'page',
            'layout',
            'error',
            'not-found',
            'loading',
            'template',
            'global-error',
          ];

          let reason;

          if (!name || !/^[A-Z]/.test(name))
            reason =
              'JSX를 반환하는 함수는 대문자로 시작하는 이름의 컴포넌트로 정의한다.';
          else if (count > 1) reason = '한 파일에 컴포넌트 하나만 정의한다.';
          else if (!reserved.includes(filename) && name !== filename)
            reason = '파일명과 컴포넌트명을 맞춘다.';
          if (reason)
            context.report({ node, messageId: 'invalid', data: { reason } });
        }

        return {
          FunctionDeclaration(node) {
            check(node, node.id?.name);
          },
          VariableDeclarator(node) {
            if (
              node.init?.type === 'ArrowFunctionExpression' ||
              node.init?.type === 'FunctionExpression'
            )
              check(node.init, node.id.name);
          },
        };
      },
    },
  },
};

/** 문서의 계층 경계가 코드 변경 중에도 유지되도록 검사한다. */
export default architecture;
