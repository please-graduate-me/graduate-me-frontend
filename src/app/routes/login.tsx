import { checkSession } from './-components/checkSession';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { authStatusQuery } from '@/domains/auth/api/queries';
import { safeReturnPath } from '@/domains/auth/lib/returnPath';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { Section } from '@/components/ui/layouts/Section';
import { Banner } from '@/components/ui/composites/Banner';
import { AuthButton } from './-components/AuthButton';

/** 로그인 상태를 확인하고 유효한 앱 내부 경로로만 복귀한다. */
export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    returnTo: safeReturnPath(
      typeof search.returnTo === 'string' ? search.returnTo : undefined
    ),
    error: typeof search.error === 'string' ? search.error : undefined,
  }),
  beforeLoad: async ({ context, search }) => {
    const session = await checkSession(context.queryClient);

    if (
      session?.user &&
      !['/', '/login'].includes(search.returnTo.split('?')[0])
    )
      throw redirect({ href: search.returnTo });
  },
  loader: ({ context }) => context.queryClient.fetchQuery(authStatusQuery),
  component: Login,
});

function Login() {
  const configured = Route.useLoaderData();
  const { error } = Route.useSearch();

  return (
    <Section>
      <Heading level={1}>학습 공간에 로그인</Heading>
      <Text as='p'>로그인하고 나의 자료와 학습 기록을 이어가세요.</Text>
      {error && (
        <Banner
          status='error'
          title='로그인하지 못했습니다. 다시 시도해 주세요.'
        />
      )}
      {!configured && (
        <Banner
          status='info'
          title='지금은 로그인할 수 없습니다. 잠시 후 다시 시도해 주세요.'
        />
      )}
      <AuthButton
        action='signin'
        disabled={!configured}
      />
    </Section>
  );
}
