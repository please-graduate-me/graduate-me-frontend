// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Banner } from './Banner';
import { EmptyState } from './EmptyState';
import { Pagination } from './Pagination';
import { ResultSheet } from './ResultSheet';
import { SearchField } from './SearchField';

let root: Root;
let container: HTMLDivElement;

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  document.body.replaceChildren();
  vi.unstubAllGlobals();
});

describe('안내·빈 상태·탐색 부품', () => {
  it('안내 상자는 아이콘을 고를 때만 장식 아이콘을 앞에 두고 제목 없이 본문만 쓸 수 있다', () => {
    const plain = renderToStaticMarkup(
      createElement(Banner, { status: 'info', title: '안내' }, '본문')
    );

    const note = renderToStaticMarkup(
      createElement(
        Banner,
        { status: 'note', icon: 'info', role: 'note' },
        '참고만 하세요'
      )
    );

    expect(plain).not.toContain('/icons/');
    expect(note).toContain('/icons/info.svg');
    expect(note).toContain('role="note"');
    expect(note).toContain('참고만 하세요');
  });

  it('빈 상태는 요청한 제목 수준과 그림을 쓴다', () => {
    const html = renderToStaticMarkup(
      createElement(EmptyState, {
        title: '아직 참여한 수업이 없어요',
        variant: 'dashed',
        headingLevel: 3,
        illustration: createElement('svg', { 'aria-hidden': true }),
      })
    );

    expect(html).toContain('<h3');
    expect(html).toContain('<svg');
    expect(html).not.toContain('/icons/');
  });

  it('검색 막대는 제출 시 현재 입력값을 넘기고 검색 랜드마크로 읽힌다', async () => {
    const submit = vi.fn();

    await act(async () =>
      root.render(
        createElement(SearchField, {
          label: '게시글 검색',
          defaultValue: 'habit',
          onSubmit: submit,
        })
      )
    );

    const form = container.querySelector('form');

    expect(form?.getAttribute('role')).toBe('search');
    await act(async () => form?.requestSubmit());
    expect(submit).toHaveBeenCalledWith('habit');
  });

  it('페이지 이동은 첫 페이지에서 이전을 막고 다음 페이지 번호를 넘긴다', async () => {
    const change = vi.fn();

    await act(async () =>
      root.render(
        createElement(Pagination, {
          page: 1,
          totalPages: 3,
          onPageChange: change,
        })
      )
    );

    const [previous, next] = Array.from(container.querySelectorAll('button'));

    expect(container.querySelector('nav')?.getAttribute('aria-label')).toBe(
      '페이지 이동'
    );

    expect(previous.disabled).toBe(true);
    await act(async () => next.click());
    expect(change).toHaveBeenCalledWith(2);
  });

  it('결과 시트는 상태 영역으로 결과를 알린다', () => {
    const html = renderToStaticMarkup(
      createElement(ResultSheet, {
        tone: 'success',
        title: '정답이에요!',
        description: '+15 XP',
      })
    );

    expect(html).toContain('role="status"');
    expect(html).toContain('정답이에요!');
  });
});
