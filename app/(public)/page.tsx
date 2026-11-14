import { Banner } from '@astryxdesign/core/Banner';
import { Section } from '@astryxdesign/core/Section';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import * as styles from './page.css';
import { AuthButton } from '../_components/AuthButton';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { videoPaths } from '@/domains/videos/config/paths';
import { DemoStudy } from '../_components/DemoStudy';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import { getPublicSession } from './_components/getPublicSession';
import { HeroDecor } from './_components/HeroDecor';
import { MethodStrip } from './_components/MethodStrip';
import { HowItWorksStep } from './_components/HowItWorksStep';
import { SourceIllustration } from './_components/SourceIllustration';
import { LearningPreview } from './_components/LearningPreview';
import { QuestionIllustration } from './_components/QuestionIllustration';

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
        <HeroDecor />
        <div className={styles.intro}>
          <div className={styles.riseFirst}>
            <Badge tone='neutral'>
              <Icon
                name='bookmark'
                size={14}
              />
              수업과 일상을 잇는 언어 학습
            </Badge>
          </div>
          <Heading
            level={1}
            id='home-title'
            type='display-1'
            weight='bold'
            justify='center'
            className={styles.title}>
            읽고, 듣고, 질문하며
            <br />
            <span className={styles.titleAccent}>나의 언어로.</span>
          </Heading>
          <Text
            as='p'
            display='block'
            size='lg'
            color='secondary'
            justify='center'
            className={styles.subtitle}>
            수업 PDF의 한 문장부터 영상 속 한 구절까지.
            <br />
            원문에서 이해하고, 내 표현으로 남겨 보세요.
          </Text>
          <div className={styles.accountActions}>
            {session?.user ? (
              <ButtonLink
                href={videoPaths.library}
                size='large'>
                내 학습으로 이어가기
                <Icon
                  name='arrow-right'
                  size={16}
                />
              </ButtonLink>
            ) : (
              <AuthButton
                action='signin'
                size='large'
                disabled={!configured}
              />
            )}
            <ButtonLink
              variant='secondary'
              size='large'
              href='#try-learning'>
              로그인 없이 체험하기
            </ButtonLink>
          </div>
          <small className={styles.supportNote}>
            영어 · 태국어 PDF와 영어 영상으로 시작해요.
          </small>
          {(error || (!configured && !session?.user)) && (
            <div className={styles.notices}>
              {error && (
                <Banner
                  status='error'
                  title='확인이 필요해요'
                  role='alert'>
                  로그인하지 못했습니다. Google 계정과 로그인 설정을 확인한 뒤
                  다시 시도해 주세요.
                </Banner>
              )}
              {!configured && !session?.user && (
                <Banner
                  status='info'
                  title='안내'
                  role='status'>
                  지금은 로그인할 수 없습니다. 아래의 영상 체험은 이용할 수
                  있어요.
                </Banner>
              )}
            </div>
          )}
        </div>
      </Section>
      <MethodStrip />
      <Section
        id='how-it-works'
        className={styles.steps}
        aria-label='학습 방법'>
        <Heading
          level={2}
          type='display-2'
          weight='bold'
          justify='center'>
          내 자료로, 내 속도로.
        </Heading>
        <HowItWorksStep
          number='01'
          title='나의 자료에서 시작해요'
          description='수업 PDF를 가져오거나 공개 영어 영상의 링크를 추가하세요.'
          illustration={<SourceIllustration />}
        />
        <HowItWorksStep
          number='02'
          title='한 구절씩, 내 속도로'
          description='원문을 읽고, 영상을 반복해 듣고, 필요한 표현을 기록하세요.'
          illustration={<LearningPreview />}
          reversed
        />
        <HowItWorksStep
          number='03'
          title='질문하고 다시 기억해요'
          description='선택한 원문을 커뮤니티에 질문하고, 나의 표현집으로 복습하세요.'
          illustration={<QuestionIllustration />}
        />
      </Section>
      <Section
        id='try-learning'
        className={styles.demo}
        aria-labelledby='demo-title'>
        <div className={styles.demoHeading}>
          <div className={styles.demoIntro}>
            <Badge tone='brand'>로그인 없이 체험하기</Badge>
            <Heading
              level={2}
              id='demo-title'
              type='display-3'
              weight='bold'>
              한 구절만 직접 들어볼까요?
            </Heading>
            <Text
              as='p'
              display='block'
              color='secondary'>
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
        <Heading
          level={2}
          type='display-2'
          weight='bold'
          color='inherit'
          justify='center'>
          자료는 그대로, 이해는 더 깊게.
        </Heading>
        <div className={styles.accountText}>
          <Text
            as='p'
            display='block'
            color='inherit'
            justify='center'>
            로그인하면 원문과 표현, 질문과 학습 기록을 내 공간에 남길 수 있어요.
          </Text>
        </div>
        {session?.user ? (
          <ButtonLink
            href={videoPaths.library}
            size='large'>
            내 학습 공간으로
          </ButtonLink>
        ) : (
          <AuthButton
            action='signin'
            size='large'
            disabled={!configured}
          />
        )}
      </Section>
    </>
  );
}
