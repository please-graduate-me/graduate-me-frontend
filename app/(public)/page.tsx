import * as styles from './page.css';
import { AuthButton } from '../_components/AuthButton';
import Link from 'next/link';
import { videoPaths } from '@/domains/videos/config/paths';
import { DemoStudy } from '../_components/DemoStudy';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import { getPublicSession } from './_components/getPublicSession';

/** 사용자별 세션 화면이 정적 결과로 공유되지 않게 한다. */
export const dynamic = 'force-dynamic';

/** 실제 로그인 상태와 체험을 소개 화면의 학습 진입에 연결한다. */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { configured, session } = await getPublicSession();
  const { error } = await searchParams;

  return (
    <>
      <section
        className={styles.hero}
        aria-labelledby='home-title'>
        <div className={styles.intro}>
          <Badge tone='brand'>
            <Icon
              name='bookmark'
              size={14}
            />
            수업과 일상을 잇는 언어 학습
          </Badge>
          <h1 id='home-title'>
            자료는 그대로,
            <br />
            이해는 더 깊게.
          </h1>
          <p>
            수업 PDF의 한 문장부터 영상 속 한 구절까지.
            <br />
            원문에서 이해하고, 내 표현으로 남겨 보세요.
          </p>
          <div className={styles.accountActions}>
            {session?.user ? (
              <Link
                className={styles.primaryLink}
                href={videoPaths.library}>
                내 학습으로 이어가기
                <Icon
                  name='arrow-right'
                  size={16}
                />
              </Link>
            ) : (
              <AuthButton
                action='signin'
                disabled={!configured}
              />
            )}
            <a
              className={styles.secondaryLink}
              href='#try-learning'>
              먼저 체험하기
            </a>
          </div>
          <small>영어 · 태국어 PDF와 영어 영상으로 시작해요.</small>
          {error && (
            <p
              role='alert'
              className={styles.error}>
              로그인하지 못했습니다. Google 계정과 로그인 설정을 확인한 뒤 다시
              시도해 주세요.
            </p>
          )}
          {!configured && !session?.user && (
            <p
              role='status'
              className={styles.notice}>
              지금은 로그인할 수 없습니다. 아래의 영상 체험은 이용할 수 있어요.
            </p>
          )}
        </div>
        <div
          className={styles.preview}
          aria-label='원문과 표현집 학습 예시'>
          <article className={styles.reading}>
            <small>READING 03 · 학습 예시</small>
            <p className={styles.readingTitle}>
              Language opens
              <br />
              new perspectives.
            </p>
            <p className={styles.highlight}>Learning a language opens doors.</p>
          </article>
          <article className={styles.expression}>
            <div className={styles.expressionTitle}>
              <Icon name='bookmark' />
              <h2>opens doors</h2>
            </div>
            <p>새로운 기회를 열어 주다</p>
            <span className={styles.source}>
              <Icon
                name='file-text'
                size={14}
              />
              영어 읽기 · 3페이지
            </span>
            <Link
              href='/expressions'
              className={styles.primaryLink}>
              내 표현집 열기
              <Icon
                name='arrow-up-right'
                size={16}
              />
            </Link>
          </article>
        </div>
      </section>
      <section
        id='how-it-works'
        className={styles.steps}
        aria-label='학습 방법'>
        <div>
          <span>01</span>
          <h2>나의 자료에서 시작해요</h2>
          <p>수업 PDF를 가져오거나 공개 영어 영상의 링크를 추가하세요.</p>
        </div>
        <div>
          <span>02</span>
          <h2>한 구절씩, 내 속도로</h2>
          <p>원문을 읽고, 영상을 반복해 듣고, 필요한 표현을 기록하세요.</p>
        </div>
        <div>
          <span>03</span>
          <h2>질문하고 다시 기억해요</h2>
          <p>선택한 원문을 커뮤니티에 질문하고, 나의 표현집으로 복습하세요.</p>
        </div>
      </section>
      <section
        id='try-learning'
        className={styles.demo}
        aria-labelledby='demo-title'>
        <div className={styles.demoHeading}>
          <div>
            <Badge tone='brand'>로그인 없이 체험하기</Badge>
            <h2 id='demo-title'>한 구절만 직접 들어볼까요?</h2>
            <p>들리는 만큼 쓰고, 안 들린 부분은 다시 들어 보세요.</p>
          </div>
          <span className={styles.demoNote}>영어 영상 받아쓰기 체험</span>
        </div>
        <DemoStudy />
      </section>
      <section
        className={styles.account}
        aria-label='내 학습으로 이어가기'>
        <div>
          <h2>내 자료로, 내 속도로.</h2>
          <p>
            로그인하면 원문과 표현, 질문과 학습 기록을 내 공간에 남길 수 있어요.
          </p>
        </div>
        {session?.user ? (
          <Link
            className={styles.primaryLink}
            href={videoPaths.library}>
            내 학습 공간으로
          </Link>
        ) : (
          <AuthButton
            action='signin'
            disabled={!configured}
          />
        )}
      </section>
    </>
  );
}
