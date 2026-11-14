import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Icon } from './Icon';

describe('서비스 아이콘의 Astryx 연결', () => {
  it('장식 아이콘을 읽지 않고 서비스 SVG와 요청 크기를 유지한다', () => {
    const html = renderToStaticMarkup(
      createElement(Icon, { name: 'file-text', size: 24 })
    );

    expect(html).toContain('/icons/file-text.svg');
    expect(html).toContain('width:24px;height:24px');
    expect(html).toContain('aria-hidden="true"');
  });
});
