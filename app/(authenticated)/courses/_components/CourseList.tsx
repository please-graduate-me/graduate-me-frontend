'use client';
import { contentLabel } from '@/components/ui/primitives/contentLabel';
import { Banner } from '@/components/ui/composites/Banner';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { Collapsible } from '@/components/ui/composites/Collapsible';
import { Select } from '@/components/ui/primitives/Select';
import { Card } from '@/components/ui/primitives/Card';
import { Icon } from '@/components/ui/primitives/Icon';
import { Link } from '@/components/ui/primitives/Link';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../_components/SessionRecovery';
import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCourse, joinCourse } from '@/domains/courses/api/courses';
import type { Courses } from '@/domains/courses/model/contracts';
import { Button } from '@/components/ui/primitives/Button';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { Input } from '@/components/ui/primitives/Input';
import { EmptyState } from '@/components/ui/composites/EmptyState';
import { CourseTile } from './CourseTile';
import * as styles from './CourseList.css';

/** 초대 코드 가입과 내 수업 탐색을 개인 학습에서 분리한다. */
export function CourseList({ initial }: { initial: Courses }) {
  const router = useRouter();
  const inviteId = useId();
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState<'en' | 'th'>('en');
  const [code, setCode] = useState('');
  // 참여와 개설은 서로 다른 버튼이라 진행 상태도 따로 두어 누른 버튼에만 스피너를 보인다.
  const [pending, setPending] = useState<'join' | 'create' | null>(null);

  const [error, setError] = useState<{
    from: 'join' | 'create';
    message: string;
  } | null>(null);

  const [sessionExpired, setSessionExpired] = useState(false);

  async function join(event: React.FormEvent) {
    event.preventDefault();
    if (pending) return;
    setPending('join');
    setError(null);

    try {
      const { id } = await joinCourse(code.trim());

      router.push(`/courses/${encodeURIComponent(id)}`);
      router.refresh();
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError({ from: 'join', message: (error as Error).message });
    } finally {
      setPending(null);
    }
  }

  async function create(event: React.FormEvent) {
    event.preventDefault();
    if (pending) return;
    setPending('create');
    setError(null);

    try {
      const result = await createCourse({ title, language });

      router.push(`/courses/${encodeURIComponent(result.id)}`);
      router.refresh();
    } catch (error) {
      setError({ from: 'create', message: (error as Error).message });
    } finally {
      setPending(null);
    }
  }

  return (
    <div className={styles.page}>
      <div>
        <Heading level={1}>내 수업과 과제</Heading>
        <Text
          as='p'
          display='block'
          color='secondary'
          className={styles.description}>
          개인 학습과 과제 제출 기록을 따로 보관합니다.
        </Text>
      </div>
      <div className={styles.actions}>
        <section
          aria-labelledby={`${inviteId}-title`}
          className={styles.join}>
          <svg
            aria-hidden='true'
            className={styles.ticket}
            width='112'
            height='88'
            viewBox='0 0 112 88'
            fill='none'>
            <rect
              className={styles.ticketBody}
              x='8'
              y='14'
              width='96'
              height='60'
              rx='14'
            />
            <circle
              className={styles.ticketNotch}
              cx='8'
              cy='44'
              r='10'
            />
            <circle
              className={styles.ticketNotch}
              cx='104'
              cy='44'
              r='10'
            />
            <path
              className={styles.ticketCut}
              d='M40 22v44'
              strokeWidth='3'
              strokeDasharray='4 5'
            />
            <rect
              className={styles.ticketLine}
              x='52'
              y='32'
              width='36'
              height='8'
              rx='4'
            />
            <rect
              className={styles.ticketLineSoft}
              x='52'
              y='48'
              width='24'
              height='8'
              rx='4'
            />
            <path
              className={styles.ticketCheck}
              d='m18 36 4 8 4-8'
              strokeWidth='3'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          <div className={styles.joinBody}>
            <Heading
              level={2}
              id={`${inviteId}-title`}
              className={styles.joinTitle}>
              초대 코드로 수업 참여
            </Heading>
            <form
              className={styles.joinForm}
              onSubmit={(event) => void join(event)}>
              <div className={styles.joinField}>
                {/* 어두운 면 위에서도 읽히도록 입력 이름을 화면에서 직접 그리고 입력과 연결한다. */}
                <label
                  htmlFor={inviteId}
                  className={styles.joinLabel}>
                  수업 초대 코드
                </label>
                <Input
                  id={inviteId}
                  aria-label='수업 초대 코드'
                  size='large'
                  isBorderless
                  isNumeric
                  value={code}
                  required
                  maxLength={36}
                  autoComplete='off'
                  placeholder='담당자가 공유한 초대 코드'
                  onChange={(event) => setCode(event.target.value)}
                />
              </div>
              <Button
                size='prominent'
                shape='rounded'
                loading={pending === 'join'}
                disabled={pending === 'create'}>
                수업 참여
              </Button>
            </form>
            {sessionExpired && <SessionRecovery />}
            {error?.from === 'join' && (
              <Banner
                status='warning'
                icon='circle-alert'
                title='확인이 필요해요'
                role='alert'>
                {error.message}
              </Banner>
            )}
          </div>
        </section>
        <Card
          as='section'
          aria-label='수업 개설'
          className={styles.create}>
          <Collapsible
            trigger={
              <span className={styles.createTrigger}>
                <span className={styles.createIcon}>
                  <Icon
                    name='plus'
                    size={20}
                  />
                </span>
                수업 개설
              </span>
            }>
            <form
              className={styles.createForm}
              onSubmit={(event) => void create(event)}>
              <Input
                label={contentLabel(<>수업 이름</>)}
                required
                value={title}
                maxLength={200}
                onChange={(event) => setTitle(event.target.value)}
              />
              <Select
                label={contentLabel(<>언어</>)}
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value as 'en' | 'th')
                }>
                <option value='en'>영어</option>
                <option value='th'>태국어</option>
              </Select>
              {error?.from === 'create' && (
                <Banner
                  status='error'
                  icon='circle-alert'
                  title='확인이 필요해요'
                  role='alert'>
                  {error.message}
                </Banner>
              )}
              <Button
                variant='ink'
                loading={pending === 'create'}
                disabled={pending === 'join'}>
                수업 만들기
              </Button>
            </form>
          </Collapsible>
        </Card>
      </div>
      <section
        aria-labelledby={`${inviteId}-mine`}
        className={styles.mine}>
        <div className={styles.mineHeading}>
          <span
            aria-hidden='true'
            className={styles.mineIcon}>
            <Icon
              name='graduation-cap'
              size={22}
            />
          </span>
          <Heading
            level={2}
            id={`${inviteId}-mine`}
            className={styles.mineTitle}>
            참여한 수업
            <span className={styles.count}>{initial.items.length}</span>
          </Heading>
        </div>
        {!initial.items.length ? (
          <EmptyState
            variant='dashed'
            headingLevel={3}
            title='아직 참여한 수업이 없어요'
            description='담당자의 초대 코드로 참여하거나 자료 보관함에서 개인 학습을 시작하세요.'
            illustration={
              <svg
                aria-hidden='true'
                width='96'
                height='72'
                viewBox='0 0 96 72'
                fill='none'>
                <rect
                  className={styles.emptyBoard}
                  x='10'
                  y='8'
                  width='64'
                  height='44'
                  rx='10'
                />
                <rect
                  className={styles.emptyLine}
                  x='20'
                  y='20'
                  width='28'
                  height='5'
                  rx='2.5'
                />
                <rect
                  className={styles.emptyLine}
                  x='20'
                  y='31'
                  width='18'
                  height='5'
                  rx='2.5'
                />
                <circle
                  className={styles.emptyPlusCircle}
                  cx='74'
                  cy='50'
                  r='16'
                />
                <path
                  className={styles.emptyPlus}
                  d='M74 43v14M67 50h14'
                  strokeWidth='3'
                  strokeLinecap='round'
                />
              </svg>
            }>
            <ButtonLink
              href='/materials'
              variant='secondary'>
              개인 자료로 학습하기
            </ButtonLink>
          </EmptyState>
        ) : (
          <ul className={styles.grid}>
            {initial.items.map((item) => (
              <li
                key={item.id}
                className={styles.cell}>
                <CourseTile item={item} />
              </li>
            ))}
            <li className={styles.cell}>
              <Link
                href='/materials'
                className={styles.personal}>
                <span
                  aria-hidden='true'
                  className={styles.personalIcon}>
                  <Icon
                    name='file-text'
                    size={22}
                  />
                </span>
                개인 자료로 학습하기
              </Link>
            </li>
          </ul>
        )}
      </section>
    </div>
  );
}
