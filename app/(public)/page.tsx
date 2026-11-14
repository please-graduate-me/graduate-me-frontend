import { Banner } from '@astryxdesign/core/Banner';
import { Section } from '@astryxdesign/core/Section';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Card } from '@astryxdesign/core/Card';
import * as styles from './page.css';
import { AuthButton } from '../_components/AuthButton';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { Link } from '@astryxdesign/core/Link';
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
      <Section
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
          <Heading
            level={1}
            id='home-title'>
            자료는 그대로,
            <br />
            이해는 더 깊게.
          </Heading>
          <Text
            as='p'
            display='block'>
            수업 PDF의 한 문장부터 영상 속 한 구절까지.
            <br />
            원문에서 이해하고, 내 표현으로 남겨 보세요.
          </Text>
          <div className={styles.accountActions}>
            {session?.user ? (
              <ButtonLink href={videoPaths.library}>
                내 학습으로 이어가기
                <Icon
                  name='arrow-right'
                  size={16}
                />
              </ButtonLink>
            ) : (
              <AuthButton
                action='signin'
                disabled={!configured}
              />
            )}
            <Link
              className={styles.secondaryLink}
              href='#try-learning'>
              먼저 체험하기
            </Link>
          </div>
          <small>영어 · 태국어 PDF와 영어 영상으로 시작해요.</small>
          {error && (
            <Banner
              status='error'
              title='확인이 필요해요'
              role='alert'>
              로그인하지 못했습니다. Google 계정과 로그인 설정을 확인한 뒤 다시
              시도해 주세요.
            </Banner>
          )}
          {!configured && !session?.user && (
            <Banner
              status='info'
              title='안내'
              role='status'>
              지금은 로그인할 수 없습니다. 아래의 영상 체험은 이용할 수 있어요.
            </Banner>
          )}
        </div>
        <div
          className={styles.preview}
          aria-label='원문과 표현집 학습 예시'>
          <Card className={styles.reading}>
            <small>READING 03 · 학습 예시</small>
            <Text
              as='p'
              display='block'
              className={styles.readingTitle}>
              Language opens
              <br />
              new perspectives.
            </Text>
            <Text
              as='p'
              display='block'
              className={styles.highlight}>
              Learning a language opens doors.
            </Text>
          </Card>
          <Card className={styles.expression}>
            <div className={styles.expressionTitle}>
              <Icon name='bookmark' />
              <Heading level={2}>opens doors</Heading>
            </div>
            <Text
              as='p'
              display='block'>
              새로운 기회를 열어 주다
            </Text>
            <span className={styles.source}>
              <Icon
                name='file-text'
                size={14}
              />
              영어 읽기 · 3페이지
            </span>
            <ButtonLink href='/expressions'>
              내 표현집 열기
              <Icon
                name='arrow-up-right'
                size={16}
              />
            </ButtonLink>
          </Card>
        </div>
      </Section>
      <Section
        id='how-it-works'
        className={styles.steps}
        aria-label='학습 방법'>
        <div>
          <span>01</span>
          <Heading level={2}>나의 자료에서 시작해요</Heading>
          <Text
            as='p'
            display='block'>
            수업 PDF를 가져오거나 공개 영어 영상의 링크를 추가하세요.
          </Text>
        </div>
        <div>
          <span>02</span>
          <Heading level={2}>한 구절씩, 내 속도로</Heading>
          <Text
            as='p'
            display='block'>
            원문을 읽고, 영상을 반복해 듣고, 필요한 표현을 기록하세요.
          </Text>
        </div>
        <div>
          <span>03</span>
          <Heading level={2}>질문하고 다시 기억해요</Heading>
          <Text
            as='p'
            display='block'>
            선택한 원문을 커뮤니티에 질문하고, 나의 표현집으로 복습하세요.
          </Text>
        </div>
      </Section>
      <Section
        id='try-learning'
        className={styles.demo}
        aria-labelledby='demo-title'>
        <div className={styles.demoHeading}>
          <div>
            <Badge tone='brand'>로그인 없이 체험하기</Badge>
            <Heading
              level={2}
              id='demo-title'>
              한 구절만 직접 들어볼까요?
            </Heading>
            <Text
              as='p'
              display='block'>
              들리는 만큼 쓰고, 안 들린 부분은 다시 들어 보세요.
            </Text>
          </div>
          <span className={styles.demoNote}>영어 영상 받아쓰기 체험</span>
        </div>
        <DemoStudy />
      </Section>
      <Section
        className={styles.account}
        aria-label='내 학습으로 이어가기'>
        <div>
          <Heading level={2}>내 자료로, 내 속도로.</Heading>
          <Text
            as='p'
            display='block'>
            로그인하면 원문과 표현, 질문과 학습 기록을 내 공간에 남길 수 있어요.
          </Text>
        </div>
        {session?.user ? (
          <ButtonLink href={videoPaths.library}>내 학습 공간으로</ButtonLink>
        ) : (
          <AuthButton
            action='signin'
            disabled={!configured}
          />
        )}
      </Section>
    </>
  );
}
