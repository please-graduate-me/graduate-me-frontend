import { redirect } from 'next/navigation';
import { requireSession } from '../../requireSession';
import { getLearningProfile } from '@/domains/users/api/profile';
import { listCommunityPosts } from '@/domains/community/api/community';
import { CommunityList } from '../_components/CommunityList';

/** 조교에게 태그된 글도 기존 게시글의 공개 범위를 그대로 적용한다. */
export default async function TaggedCommunityPage() {
  const { transport } = await requireSession();
  const profile = await getLearningProfile(transport);

  if (!profile.isHelper) redirect('/community');

  const initial = await listCommunityPosts(
    { language: profile.targetLanguage, tagged: true },
    transport
  );

  return (
    <CommunityList
      initial={initial}
      initialLanguage={profile.targetLanguage}
      tagged
    />
  );
}
