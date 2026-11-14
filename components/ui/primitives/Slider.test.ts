import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Slider } from './Slider';

describe('Astryx 재생 탐색의 접근성과 폼 값', () => {
  it('재생 범위와 위치를 보조 기술 및 폼에 전달한다', () => {
    const html = renderToStaticMarkup(
      createElement(Slider, {
        min: 0,
        max: 200,
        value: 50,
        step: 0.1,
        name: 'position',
        onChange: () => {},
        style: { width: 300 },
        'aria-label': '재생 위치',
        'aria-valuetext': '50초',
      })
    );

    expect(html).toContain('role="slider"');
    expect(html).toContain('aria-valuemin="0"');
    expect(html).toContain('aria-valuemax="200"');
    expect(html).toContain('aria-valuenow="50"');
    expect(html).toContain('aria-valuetext="50초"');
    expect(html).toContain('name="position"');
    expect(html).toContain('width:300px');
  });
});
