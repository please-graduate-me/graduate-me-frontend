import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';

/** 기존 화면의 변경 후 조회를 갱신하되 입력 컴포넌트는 다시 마운트하지 않는다. */
export function useRefreshData() {
  const client = useQueryClient();
  const router = useRouter();

  return async () => {
    await client.invalidateQueries({
      predicate: (query) => query.queryKey[0] !== 'auth',
    });

    await router.invalidate();
  };
}
