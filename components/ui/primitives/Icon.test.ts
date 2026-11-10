import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Icon } from './Icon';

vi.mock('./Icon.css', () => ({
  root: 'icon',
  source: 'var(--icon-source)',
}));

describe('아이콘 마스크의 서버 HTML', () => {
  it('CSS 변수 참조를 실제 속성 이름으로 전달해 SVG 윤곽과 크기를 유지한다', () => {
    const html = renderToStaticMarkup(
      createElement(Icon, { name: 'file-text', size: 24 })
    );

    expect(html).toContain('--icon-source:url(/icons/file-text.svg)');
    expect(html).not.toContain('var(--icon-source):');
    expect(html).toContain('width:24px;height:24px');
    expect(html).toContain('aria-hidden="true"');
  });
});
