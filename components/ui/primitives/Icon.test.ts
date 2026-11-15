import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Icon, iconNames } from './Icon';

describe('서비스 아이콘 표시', () => {
  it('장식 아이콘을 읽지 않고 서비스 SVG와 요청 크기를 유지한다', () => {
    const html = renderToStaticMarkup(
      createElement(Icon, { name: 'file-text', size: 24 })
    );

    expect(html).toContain('/icons/file-text.svg');
    expect(html).toContain('width:24px;height:24px');
    expect(html).toContain('aria-hidden="true"');
  });

  it('등록한 아이콘 이름마다 public/icons에 SVG 파일이 있다', () => {
    const missing = iconNames.filter(
      (name) =>
        !existsSync(
          fileURLToPath(
            new URL(`../../../public/icons/${name}.svg`, import.meta.url)
          )
        )
    );

    expect(missing).toEqual([]);
  });
});
