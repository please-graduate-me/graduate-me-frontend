import { checkSession } from '../-components/checkSession';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getLearningProfileQuery } from '@/domains/users/api/queries';
import { GrowthFeedback } from '../-components/GrowthFeedback';
import { StudentShell } from './-components/StudentShell';

/** 모든 개인 조회보다 먼저 세션을 확인하고 공통 학습 틀을 적용한다. */
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    const session = await checkSession(context.queryClient);

    if (!session?.user)
      throw redirect({
        to: '/login',
        search: { returnTo: location.href, error: undefined },
      });

    return { session };
  },
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(getLearningProfileQuery()),
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { session } = Route.useRouteContext();
  const { data: profile } = useSuspenseQuery(getLearningProfileQuery());

  return (
    <>
      <GrowthFeedback />
      <StudentShell
        name={session.user.name ?? '학습자'}
        isHelper={profile.isHelper}>
        <Outlet />
      </StudentShell>
    </>
  );
}
