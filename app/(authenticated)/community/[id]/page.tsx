import { requireSession } from '../../requireSession';
import {
  getCommunityPost,
  listRelatedCommunityPosts,
} from '@/domains/community/api/community';
import { CommunityThread } from './_components/CommunityThread';

/** 공개 대상 검사를 통과한 글과 댓글만 가져온다. */
export default async function CommunityPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { transport } = await requireSession();
  const { id } = await params;

  const [initial, related] = await Promise.all([
    getCommunityPost(id, transport),
    // 같은 구절 목록은 보조 정보라 실패해도 글 본문은 그대로 보여 준다.
    listRelatedCommunityPosts(id, transport).catch(() => ({ items: [] })),
  ]);

  return (
    <CommunityThread
      initial={initial}
      related={related.items}
    />
  );
}
