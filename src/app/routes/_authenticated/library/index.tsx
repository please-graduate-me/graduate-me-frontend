import { createFileRoute } from '@tanstack/react-router';
import { Text } from '@/components/ui/primitives/Text';
import { Heading } from '@/components/ui/primitives/Heading';
import { GrowthCard } from '../-components/GrowthCard';
import * as styles from './index.css';
import { Dashboard } from './-components/Dashboard';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { getLearningProfileQuery } from '@/domains/users/api/queries';

/** URL 조건과 인증된 조회 결과를 화면에 연결한다. */
export const Route = createFileRoute('/_authenticated/library/')({
  loader: async ({ context }) => {
    const { session } = context;

    const profile = await context.queryClient.fetchQuery(
      getLearningProfileQuery()
    );

    const today = new Intl.DateTimeFormat('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      timeZone: 'Asia/Seoul',
    }).format(new Date());

    return { session, profile, today };
  },
  component: LibraryPage,
});

function LibraryPage() {
  const { session, profile, today } = Route.useLoaderData();

  return (
    <div className={styles.root}>
      <aside className={styles.aside}>
        <GrowthCard />
      </aside>
      <div className={styles.main}>
        <div className={styles.intro}>
          <div>
            <Text
              as='p'
              display='block'
              color='secondary'>
              {today}
            </Text>
            <Heading level={1}>
              {session.user.name ?? '학습자'}님, 오늘은 어디서 이어갈까요?
            </Heading>
          </div>
          <ButtonLink
            href='/materials?add=1'
            variant='ink'
            size='comfortable'
            startIcon='plus'>
            자료 추가
          </ButtonLink>
        </div>
        <Dashboard language={profile.targetLanguage} />
      </div>
    </div>
  );
}
