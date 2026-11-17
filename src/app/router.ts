import { parseUrlSearch, stringifyUrlSearch } from '@/lib/routing/search';
import { createRouter } from '@tanstack/react-router';
import { queryClient } from './queryClient';
import { routeTree } from './routeTree.gen';

/** 화면 진입 시에만 조회하고 라우터와 Query 캐시의 유효 기간을 분리한다. */
export const router = createRouter({
  routeTree,
  parseSearch: parseUrlSearch,
  stringifySearch: stringifyUrlSearch,
  context: { queryClient },
  scrollRestoration: true,
  defaultPreload: false,
  defaultPreloadStaleTime: 0,
  defaultStaleTime: 0,
  defaultGcTime: 0,
});

declare module '@tanstack/react-router' {
  /** 이동 경로와 검색 조건을 생성된 라우트 타입으로 검사한다. */
  interface Register {
    router: typeof router;
  }
}
