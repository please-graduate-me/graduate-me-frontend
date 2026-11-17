import { QueryClient } from '@tanstack/react-query';

/** 학습 입력 중에는 자동 재조회와 요청 재시도로 상태를 덮어쓰지 않는다. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: { retry: false },
  },
});
