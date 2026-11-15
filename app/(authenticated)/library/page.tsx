import { Text } from '@/components/ui/primitives/Text';
import { Heading } from '@/components/ui/primitives/Heading';
import { GrowthCard } from '../_components/GrowthCard';
import * as styles from './page.css';
import { requireSession } from '../requireSession';
import { Dashboard } from './_components/Dashboard';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { getLearningProfile } from '@/domains/users/api/profile';

/** 로그인한 계정의 현재 날짜와 개인 학습 홈을 표시하고 복습 집계에 쓸 학습 언어를 넘긴다. */
export default async function LibraryPage() {
  const { session, transport } = await requireSession();
  const profile = await getLearningProfile(transport);

  const today = new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timeZone: 'Asia/Seoul',
  }).format(new Date());

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
