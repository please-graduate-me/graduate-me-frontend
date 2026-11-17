import { useRefreshData } from '../../../-components/useRefreshData';
import { AlertDialog } from '@/components/ui/composites/AlertDialog';
import { useConfirmation } from '@/lib/hooks/useConfirmation';
import { contentLabel } from '@/components/ui/primitives/contentLabel';
import { Banner } from '@/components/ui/composites/Banner';
import { Heading } from '@/components/ui/primitives/Heading';
import { Card } from '@/components/ui/primitives/Card';
import { Avatar } from '@/components/ui/primitives/Avatar';
import { useState } from 'react';
import type { CourseDetail } from '@/domains/courses/model/contracts';
import { saveCourseMember } from '@/domains/courses/api/courses';
import { Button } from '@/components/ui/primitives/Button';
import { Select } from '@/components/ui/primitives/Select';
import { Input } from '@/components/ui/primitives/Input';
import * as styles from './CourseManagement.css';

const memberRoles = {
  teacher: '개설자',
  assistant: '수업 조교',
  student: '수강생',
} as const;

/** 수업 역할 관리는 서비스 웹에서 수행하고 프로필 조교 자격은 부여하지 않는다. */
export function CourseManagement({
  value,
  currentUserId,
}: {
  value: CourseDetail;
  currentUserId: string;
}) {
  const confirmation = useConfirmation();

  const refreshData = useRefreshData();
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState<'student' | 'assistant'>('student');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (value.course.role === 'student') return null;
  const isTeacher = value.course.role === 'teacher';

  async function member(
    input:
      { userId: string; role: 'student' | 'assistant' } | { remove: string }
  ) {
    if (busy) return;
    setBusy(true);
    setError('');

    try {
      await saveCourseMember(value.course.id, input);
      void refreshData();
      setUserId('');
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside
      aria-labelledby='course-management'
      className={styles.root}>
      <AlertDialog {...confirmation.dialog} />
      <Heading
        level={2}
        id='course-management'
        className={styles.title}>
        수업 관리
      </Heading>
      {value.course.inviteCode && (
        <section
          aria-label='초대 코드'
          className={styles.invite}>
          <p className={styles.inviteLabel}>초대 코드</p>
          <p className={styles.inviteCode}>{value.course.inviteCode}</p>
        </section>
      )}
      {isTeacher && (
        <Card>
          <form
            aria-labelledby='course-member-add'
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              void member({ userId, role });
            }}>
            <Heading
              level={3}
              id='course-member-add'
              className={styles.cardTitle}>
              구성원 추가
            </Heading>
            <Input
              label={contentLabel(<>추가할 계정 식별자</>)}
              required
              maxLength={128}
              autoComplete='off'
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
            />
            <div className={styles.roleRow}>
              <Select
                className={styles.roleField}
                label={contentLabel(<>수업 역할</>)}
                value={role}
                onChange={(event) =>
                  setRole(event.target.value as typeof role)
                }>
                <option value='student'>수강생</option>
                <option value='assistant'>수업 조교</option>
              </Select>
              <Button
                variant='ink'
                size='comfortable'
                shape='rounded'
                loading={busy}>
                구성원 저장
              </Button>
            </div>
            <Banner status='info'>
              수업 조교는 이 수업의 과제를 관리합니다. 프로필의 커뮤니티 조교
              타이틀과 별도입니다.
            </Banner>
          </form>
        </Card>
      )}
      {error && (
        <Banner
          status='error'
          title='확인이 필요해요'
          role='alert'>
          {error}
        </Banner>
      )}
      <Card
        as='section'
        aria-labelledby='course-members'
        className={styles.members}>
        <Heading
          level={3}
          id='course-members'
          className={styles.cardTitle}>
          구성원
          <span className={styles.count}>{value.members.length}</span>
        </Heading>
        <ul className={styles.list}>
          {value.members.map((memberValue) => {
            const isSelf = memberValue.userId === currentUserId;
            const name = isSelf ? '나' : (memberValue.name ?? '학습자');
            const roleLabel = memberRoles[memberValue.role];

            return (
              <li
                className={styles.member}
                key={memberValue.userId}>
                <span
                  aria-hidden='true'
                  className={styles.avatar}>
                  <Avatar
                    name={name}
                    size={32}
                    tone={isSelf ? 'self' : 'auto'}
                    tooltip={false}
                  />
                </span>
                <span className={styles.who}>
                  <span className={styles.name}>{name}</span>
                  <span className={styles.role}>{roleLabel}</span>
                </span>
                {isTeacher && memberValue.role !== 'teacher' && (
                  <>
                    <Select
                      className={styles.memberSelect}
                      aria-label={`${name} 수업 역할`}
                      value={memberValue.role}
                      disabled={busy}
                      onChange={(event) =>
                        void member({
                          userId: memberValue.userId,
                          role: event.target.value as 'student' | 'assistant',
                        })
                      }>
                      <option value='student'>수강생</option>
                      <option value='assistant'>수업 조교</option>
                    </Select>
                    <Button
                      type='button'
                      variant='danger-outline'
                      shape='rounded'
                      aria-label={`${name} 수업에서 제외`}
                      disabled={busy}
                      onClick={async () => {
                        if (
                          await confirmation.confirm(
                            '이 구성원을 수업에서 제외할까요?',
                            undefined,
                            {
                              detail: (
                                <>
                                  {name}
                                  <span className={styles.confirmRole}>
                                    {roleLabel}
                                  </span>
                                </>
                              ),
                            }
                          )
                        )
                          void member({ remove: memberValue.userId });
                      }}>
                      제외
                    </Button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </Card>
    </aside>
  );
}
