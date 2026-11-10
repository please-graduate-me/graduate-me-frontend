import { requireSession } from '../../requireSession';
import { getCommunityPost } from '@/domains/community/api/community';
import { CommunityThread } from './_components/CommunityThread';

/** 공개 대상 검사를 통과한 글과 댓글만 가져온다. */
export default async function CommunityPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { transport } = await requireSession();
  const { id } = await params;
  const initial = await getCommunityPost(id, transport);

  return <CommunityThread initial={initial} />;
}
