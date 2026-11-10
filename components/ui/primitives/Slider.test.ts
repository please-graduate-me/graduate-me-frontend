import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Slider } from './Slider';

vi.mock('./Slider.css', () => ({
  root: 'slider',
  progress: 'var(--slider-progress)',
}));

describe('재생 탐색 트랙의 서버 HTML', () => {
  it('실제 CSS 변수에 채움 값을 전달하면서 사용처 스타일을 보존한다', () => {
    const html = renderToStaticMarkup(
      createElement(Slider, {
        min: 0,
        max: 200,
        value: 50,
        onChange: () => {},
        style: { width: 300 },
        'aria-label': '재생 위치',
      })
    );

    expect(html).toContain('--slider-progress:25%');
    expect(html).not.toContain('var(--slider-progress):');
    expect(html).toContain('width:300px');
    expect(html).toContain('type="range"');
  });
});
