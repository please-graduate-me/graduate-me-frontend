import * as styles from './page.css';
import { createServerTransport } from '@/lib/api/server';
import { getSession, isAuthConfigured } from '@/domains/auth/api/auth';
import { AuthButton } from '../_components/AuthButton';
import Link from 'next/link';
import { videoPaths } from '@/domains/videos/config/paths';
import { DemoStudy } from '../_components/DemoStudy';

/** 사용자별 세션 화면이 정적 결과로 공유되지 않게 한다. */
export const dynamic = 'force-dynamic';

/** 세션에 맞는 진입 화면을 서버에서 선택한다. */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const transport = await createServerTransport();
  const configured = await isAuthConfigured(transport);
  const session = configured ? await getSession(transport) : null;
  const { error } = await searchParams;

  return (
    <>
      <section className={styles.intro}>
        <h1>
          들리는 만큼 쓰고,
          <br />안 들린 부분은 다시.
        </h1>
        <p>
          유튜브 영상을 한 구절씩 듣고 받아쓰며
          <br />
          실제 영어 소리에 익숙해지세요.
        </p>
      </section>
      {error && (
        <p
          role='alert'
          className={styles.error}>
          로그인하지 못했습니다. Google 계정과 로그인 설정을 확인한 뒤 다시
          시도해 주세요.
        </p>
      )}
      <DemoStudy />
      <section
        className={styles.account}
        aria-label='내 학습으로 이어가기'>
        <div>
          <h2>
            {session?.user
              ? '내 영상으로 이어서 학습하기'
              : '내 영상으로, 내 속도로.'}
          </h2>
          <p>
            {session?.user ? (
              `${session.user.name ?? '학습자'} 님, 저장한 답안과 진도에서 이어서 시작하세요.`
            ) : (
              <>
                Google 계정으로 로그인하면 답안과 진도를 저장할 수 있어요.
                <br />
                원하는 공개 영어 영상도 가져올 수 있어요. 최대 15분까지
                지원합니다.
              </>
            )}
          </p>
        </div>
        <div className={styles.accountActions}>
          {session?.user ? (
            <>
              <Link
                className={styles.libraryLink}
                href={videoPaths.library}>
                내 영상으로 이동
              </Link>
              <AuthButton action='signout' />
            </>
          ) : (
            <AuthButton
              action='signin'
              disabled={!configured}
            />
          )}
        </div>
      </section>
      {!configured && !session?.user && (
        <p
          role='status'
          className={styles.notice}>
          지금은 로그인할 수 없습니다. 체험은 이용할 수 있으니 먼저 연습해
          보세요.
        </p>
      )}
    </>
  );
}
