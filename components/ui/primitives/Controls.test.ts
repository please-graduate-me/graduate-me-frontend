import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';
import { TextArea } from './TextArea';
import { Select } from './Select';
import { Button } from './Button';

// 외형이 바뀌어도 이름·값·제출 방식은 기존 업무 폼이 기대하는 계약을 따른다.
describe('Astryx 전환 후 업무 폼 계약', () => {
  it('제목 입력의 초기값과 폼 이름 및 필수 조건을 유지한다', () => {
    const html = renderToStaticMarkup(
      createElement(Input, {
        label: '과제 제목',
        name: 'title',
        defaultValue: '첫 과제',
        required: true,
      })
    );

    expect(html).toContain('과제 제목');
    expect(html).toContain('name="title"');
    expect(html).toContain('value="첫 과제"');
    expect(html).toContain('required=""');
  });

  it('마감 시각을 시간대 변환 없이 전체 지역 시각으로 제출한다', () => {
    const html = renderToStaticMarkup(
      createElement(Input, {
        type: 'datetime-local',
        name: 'dueAt',
        defaultValue: '2026-11-20T13:45',
      })
    );

    expect(html).toContain(
      'type="hidden" name="dueAt" value="2026-11-20T13:45"'
    );
  });

  it('수정하지 않은 메모도 폼에 초기값으로 전달한다', () => {
    const html = renderToStaticMarkup(
      createElement(TextArea, {
        label: '메모',
        name: 'memo',
        defaultValue: '원래 메모',
      })
    );

    expect(html).toContain('name="memo"');
    expect(html).toContain('원래 메모</textarea>');
  });

  it('기존 option 선언의 선택값을 제출하고 선택기의 이름을 유지한다', () => {
    const html = renderToStaticMarkup(
      createElement(
        Select,
        {
          label: '학습 언어',
          id: 'language',
          name: 'language',
          defaultValue: 'th',
        },
        [
          createElement('option', { key: 'en', value: 'en' }, '영어'),
          createElement('option', { key: 'th', value: 'th' }, '태국어'),
        ]
      )
    );

    expect(html).toContain('role="combobox"');
    expect(html).toContain('id="language"');
    expect(html).toContain('name="language"');
    expect(html).toContain('value="th"');
    expect(html).toContain('태국어');
  });

  it('폼 저장 버튼은 제출을 유지하고 로딩 중 중복 제출을 막는다', () => {
    const html = renderToStaticMarkup(
      createElement(Button, { loading: true }, '저장')
    );

    const ready = renderToStaticMarkup(createElement(Button, null, '저장'));

    expect(ready).toContain('type="submit"');
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('aria-disabled="true"');
  });
});
