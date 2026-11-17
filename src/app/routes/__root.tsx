import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { RouteError } from './-components/RouteError';
import { NotFoundView } from './-components/NotFoundView';
import { RoutePending } from './-components/RoutePending';

/** 모든 라우트에 같은 조회 도구와 오류·대기 화면을 제공한다. */
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: Outlet,
    errorComponent: RouteError,
    notFoundComponent: NotFoundView,
    pendingComponent: RoutePending,
  }
);
