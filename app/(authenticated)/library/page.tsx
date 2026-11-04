import * as styles from './page.css';
import { requireSession } from '../requireSession';
import { Dashboard } from './_components/Dashboard';
import { AuthButton } from '../../_components/AuthButton';

/** 개인 영상 목록은 로그인 확인을 마친 뒤에만 렌더링한다. */
export default async function LibraryPage() {
  const { session } = await requireSession();

  return (
    <div className={styles.root}>
      <div className={styles.intro}>
        <div>
          <h1>내 영상</h1>
          <p>
            {session.user.name ?? '학습자'} 님, 저장한 구절부터 이어서
            들어보세요.
          </p>
        </div>
        <div className={styles.auth}>
          <AuthButton action='signout' />
        </div>
      </div>
      <Dashboard />
    </div>
  );
}
