import { requireSession } from '../requireSession';
import { getLearningProfile } from '@/domains/users/api/profile';
import { listCommunityPosts } from '@/domains/community/api/community';
import { sourceInputSchema } from '@/domains/materials/model/source';
import { CommunityList } from './_components/CommunityList';

/** 비공개 질문과 별도의 일반 학습 대화를 탐색한다. */
export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const { transport } = await requireSession();
  const profile = await getLearningProfile(transport);
  const search = await searchParams;
  let source: unknown;

  try {
    source = search.source ? JSON.parse(search.source) : undefined;
  } catch {
    source = undefined;
  }

  const parsed = sourceInputSchema.safeParse(source);

  const initial = await listCommunityPosts(
    { language: profile.targetLanguage },
    transport
  );

  return (
    <CommunityList
      initialLanguage={profile.targetLanguage}
      initial={initial}
      source={parsed.success ? parsed.data : undefined}
    />
  );
}
