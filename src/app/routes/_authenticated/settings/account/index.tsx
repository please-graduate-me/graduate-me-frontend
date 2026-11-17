import { createFileRoute } from '@tanstack/react-router';
import { AccountDeletion } from './-components/AccountDeletion';

/** URL 조건과 인증된 조회 결과를 화면에 연결한다. */
export const Route = createFileRoute('/_authenticated/settings/account/')({
  loader: async ({ context }) => {
    const { session } = context;

    return { session };
  },
  component: AccountPage,
});

function AccountPage() {
  const { session } = Route.useLoaderData();

  return <AccountDeletion name={session.user.name ?? '학습자'} />;
}
