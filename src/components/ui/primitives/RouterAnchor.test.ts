// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterContextProvider,
} from '@tanstack/react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseUrlSearch, stringifyUrlSearch } from '@/lib/routing/search';
import { RouterAnchor } from './RouterAnchor';

let root: Root | undefined;
let container: HTMLDivElement | undefined;

afterEach(async () => {
  if (root) await act(() => root?.unmount());
  container?.remove();
  vi.unstubAllGlobals();
});

describe('서비스 링크 이동', () => {
  it('검색 조건과 클릭 부수 동작을 유지하면서 앱 내부로 이동한다', async () => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);

    const router = createRouter({
      routeTree: createRootRoute(),
      history: createMemoryHistory(),
      parseSearch: parseUrlSearch,
      stringifySearch: stringifyUrlSearch,
    });

    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(undefined);
    const onClick = vi.fn();

    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);

    await act(() =>
      root?.render(
        createElement(RouterContextProvider, {
          router,
          children: createElement(
            RouterAnchor,
            { href: '/materials?add=1', onClick },
            '자료 추가'
          ),
        })
      )
    );

    const link = container.querySelector('a')!;

    expect(link.getAttribute('href')).toBe('/materials?add=1');

    await act(() =>
      link.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })
      )
    );

    expect(onClick).toHaveBeenCalledOnce();
    expect(navigate).toHaveBeenCalledOnce();
  });
});
