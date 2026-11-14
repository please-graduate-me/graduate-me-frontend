import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const roots = ['app', 'domains', 'components'];

const controls = new Set([
  'Button',
  'ButtonLink',
  'IconButton',
  'Input',
  'Select',
  'TextArea',
  'Slider',
  'Switch',
  'Checkbox',
  'Tab',
  'TabList',
]);

const nativeUi = new Set([
  'button',
  'input',
  'select',
  'textarea',
  'dialog',
  'details',
  'summary',
  'progress',
  'table',
]);

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);

    return entry.isDirectory()
      ? sourceFiles(file)
      : /\.(tsx?|css)$/.test(file) && !/\.test\./.test(file)
        ? [file]
        : [];
  });
}

const files = roots.flatMap((directory) =>
  sourceFiles(path.join(projectRoot, directory))
);

describe('Astryx 기본 UI와 서비스 전용 스타일의 경계', () => {
  it('화면용 기본 제어와 툴팁을 직접 구현하거나 이전 UI 토큰을 사용하지 않는다', () => {
    const violations: string[] = [];

    for (const file of files) {
      const source = readFileSync(file, 'utf8');

      if (/--ant-[\w-]+|\.ant-[\w-]+/.test(source))
        violations.push(`${file}: 이전 UI 토큰`);
      if (!file.endsWith('.tsx')) continue;

      const ast = ts.createSourceFile(
        file,
        source,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX
      );

      function visit(node: ts.Node) {
        if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
          const name = node.tagName.getText(ast);

          const hidden = node.attributes.properties.some(
            (attr) =>
              ts.isJsxAttribute(attr) &&
              attr.name.getText(ast) === 'type' &&
              attr.initializer &&
              ts.isStringLiteral(attr.initializer) &&
              attr.initializer.text === 'hidden'
          );

          if (nativeUi.has(name) && !(name === 'input' && hidden))
            violations.push(`${file}: ${name}`);

          const ownTooltip =
            /^[a-z]/.test(name) &&
            node.attributes.properties.some(
              (attr) =>
                ts.isJsxAttribute(attr) &&
                attr.name.getText(ast) === 'role' &&
                attr.initializer &&
                ts.isStringLiteral(attr.initializer) &&
                attr.initializer.text === 'tooltip'
            );

          if (ownTooltip) violations.push(`${file}: 자체 툴팁`);
        }

        ts.forEachChild(node, visit);
      }

      visit(ast);
    }

    expect(violations).toEqual([]);
  });

  it('기본 제어에 연결하는 클래스가 Astryx 외형을 다시 그리지 않는다', () => {
    const violations: string[] = [];

    const compilerOptions: ts.CompilerOptions = {
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      baseUrl: projectRoot,
      paths: { '@/*': ['./*'] },
    };

    for (const file of files.filter((name) => name.endsWith('.tsx'))) {
      const ast = ts.createSourceFile(
        file,
        readFileSync(file, 'utf8'),
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX
      );

      const imports = new Map<string, string>();

      for (const statement of ast.statements) {
        if (
          ts.isImportDeclaration(statement) &&
          ts.isStringLiteral(statement.moduleSpecifier) &&
          statement.importClause?.namedBindings &&
          ts.isNamespaceImport(statement.importClause.namedBindings)
        )
          imports.set(
            statement.importClause.namedBindings.name.text,
            statement.moduleSpecifier.text
          );
      }

      function visit(node: ts.Node) {
        if (
          (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
          controls.has(node.tagName.getText(ast))
        ) {
          const className = node.attributes.properties.find(
            (attr) =>
              ts.isJsxAttribute(attr) && attr.name.getText(ast) === 'className'
          );

          const value =
            className &&
            ts.isJsxAttribute(className) &&
            className.initializer &&
            ts.isJsxExpression(className.initializer)
              ? className.initializer.expression
              : undefined;

          if (value && ts.isPropertyAccessExpression(value)) {
            const importPath = imports.get(value.expression.getText(ast));

            const resolved = importPath
              ? ts.resolveModuleName(importPath, file, compilerOptions, ts.sys)
                  .resolvedModule?.resolvedFileName
              : undefined;

            if (resolved?.endsWith('.css.ts')) {
              const styleAst = ts.createSourceFile(
                resolved,
                readFileSync(resolved, 'utf8'),
                ts.ScriptTarget.Latest,
                true
              );

              for (const statement of styleAst.statements) {
                if (!ts.isVariableStatement(statement)) continue;

                for (const declaration of statement.declarationList
                  .declarations) {
                  if (
                    declaration.name.getText(styleAst) === value.name.text &&
                    declaration.initializer &&
                    /\b(background(?:Color)?|border(?:Radius|Color)?|boxShadow)\s*:/.test(
                      declaration.initializer.getText(styleAst)
                    )
                  )
                    violations.push(`${file}: ${value.getText(ast)}`);
                }
              }
            }
          }
        }

        ts.forEachChild(node, visit);
      }

      visit(ast);
    }

    expect(violations).toEqual([]);
  });
});
