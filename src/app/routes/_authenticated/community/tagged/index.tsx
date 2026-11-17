import { createFileRoute, redirect } from '@tanstack/react-router';
import { getLearningProfileQuery } from '@/domains/users/api/queries';
import { listCommunityPostsQuery } from '@/domains/community/api/queries';
import { CommunityList } from '../-components/CommunityList';

/** URL 조건과 인증된 조회 결과를 화면에 연결한다. */
export const Route = createFileRoute('/_authenticated/community/tagged/')({
  loader: async ({ context }) => {
    const { session } = context;

    const profile = await context.queryClient.fetchQuery(
      getLearningProfileQuery()
    );

    if (!profile.isHelper) throw redirect({ href: '/community' });

    const initial = await context.queryClient.fetchQuery(
      listCommunityPostsQuery({
        language: profile.targetLanguage,
        tagged: true,
      })
    );

    return { session, profile, initial };
  },
  component: TaggedCommunityPage,
});

function TaggedCommunityPage() {
  const { session, profile, initial } = Route.useLoaderData();

  return (
    <CommunityList
      initial={initial}
      initialLanguage={profile.targetLanguage}
      viewerId={session.user.id}
      tagged
    />
  );
}
