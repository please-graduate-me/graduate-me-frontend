import { GrowthCard } from '../_components/GrowthCard';
import * as styles from './page.css';
import { requireSession } from '../requireSession';
import { Dashboard } from './_components/Dashboard';
import { Icon } from '@/components/ui/primitives/Icon';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';

/** 로그인한 계정의 현재 날짜와 개인 학습 홈을 표시한다. */
export default async function LibraryPage() {
  const { session } = await requireSession();

  const today = new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timeZone: 'Asia/Seoul',
  }).format(new Date());

  return (
    <div className={styles.root}>
      <div className={styles.intro}>
        <div>
          <p>{today}</p>
          <h1>{session.user.name ?? '학습자'}님, 오늘은 어디서 이어갈까요?</h1>
        </div>
        <ButtonLink href='/materials?add=1'>
          <Icon
            name='plus'
            size={16}
          />
          자료 추가
        </ButtonLink>
      </div>
      <GrowthCard />
      <Dashboard />
    </div>
  );
}
