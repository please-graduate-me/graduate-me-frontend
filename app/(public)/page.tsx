import { Panel } from '@/components/ui/layouts/Panel';
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
      <div className={styles.pageHeading}>
        <div>
          <h1>
            들리는 만큼 쓰고,
            <br />안 들린 부분은 다시.
          </h1>
          <p className={styles.muted}>
            유튜브 영상을 한 구절씩 듣고 받아쓰며 실제 영어 소리에 익숙해지세요.
          </p>
        </div>
        {session?.user ? (
          <div>
            <span className={styles.account}>
              {session.user.name ?? '학습자'} 님
            </span>
            <AuthButton action='signout' />
          </div>
        ) : null}
      </div>
      {error && (
        <p
          role='alert'
          className={styles.error}>
          로그인하지 못했습니다. Google 계정과 로그인 설정을 확인한 뒤 다시
          시도해 주세요.
        </p>
      )}
      {session?.user ? (
        <Link href={videoPaths.library}>내 영상으로 이동 →</Link>
      ) : (
        <Panel>
          <h2>내 학습 기록으로 이어서 시작하기</h2>
          <p>Google 계정으로 로그인하면 입력한 답안과 진도가 저장됩니다.</p>
          <AuthButton
            action='signin'
            disabled={!configured}
          />
          {!configured && (
            <p
              role='status'
              className={styles.notice}>
              로그인 설정이 아직 준비되지 않았습니다. README의 Google OAuth
              설정을 완료해 주세요.
            </p>
          )}
          <p className={[styles.muted, styles.small].join(' ')}>
            공개 영어 영상, 최대 15분 · 풀 타이핑과 빈칸 채우기
          </p>
        </Panel>
      )}
      <DemoStudy />
    </>
  );
}
