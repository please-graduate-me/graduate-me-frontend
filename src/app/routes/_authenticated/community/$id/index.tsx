import { createFileRoute } from '@tanstack/react-router';
import {
  getCommunityPostQuery,
  listRelatedCommunityPostsQuery,
} from '@/domains/community/api/queries';
import { CommunityThread } from './-components/CommunityThread';

/** URL 조건과 인증된 조회 결과를 화면에 연결한다. */
export const Route = createFileRoute('/_authenticated/community/$id/')({
  loader: async ({ context, params }) => {
    const { id } = params;

    const [initial, related] = await Promise.all([
      context.queryClient.fetchQuery(getCommunityPostQuery(id)),
      // 같은 구절 목록은 보조 정보라 실패해도 글 본문은 그대로 보여 준다.
      context.queryClient
        .fetchQuery(listRelatedCommunityPostsQuery(id))
        .catch(() => ({ items: [] })),
    ]);

    return { initial, related };
  },
  component: CommunityPostPage,
});

function CommunityPostPage() {
  const { initial, related } = Route.useLoaderData();

  return (
    <CommunityThread
      initial={initial}
      related={related.items}
    />
  );
}
