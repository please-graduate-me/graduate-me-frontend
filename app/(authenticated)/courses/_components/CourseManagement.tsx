'use client';
import { AlertDialog } from '@/components/ui/composites/AlertDialog';
import { useConfirmation } from '@/lib/hooks/useConfirmation';
import { contentLabel } from '@/components/ui/primitives/contentLabel';
import { Banner } from '@/components/ui/composites/Banner';
import { Section } from '@/components/ui/layouts/Section';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CourseDetail } from '@/domains/courses/model/contracts';
import { saveCourseMember } from '@/domains/courses/api/courses';
import { Button } from '@/components/ui/primitives/Button';
import { Select } from '@/components/ui/primitives/Select';
import { Input } from '@/components/ui/primitives/Input';
import { CourseAssignmentEditor } from './CourseAssignmentEditor';
import * as styles from '@/lib/styles/workspace.css';

/** 수업 역할 관리는 서비스 웹에서 수행하고 프로필 조교 자격은 부여하지 않는다. */
export function CourseManagement({ value }: { value: CourseDetail }) {
  const confirmation = useConfirmation();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState<'student' | 'assistant'>('student');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (value.course.role === 'student') return null;

  async function member(
    input:
      { userId: string; role: 'student' | 'assistant' } | { remove: string }
  ) {
    if (busy) return;
    setBusy(true);
    setError('');

    try {
      await saveCourseMember(value.course.id, input);
      router.refresh();
      setUserId('');
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Section className={styles.stack}>
      <AlertDialog {...confirmation.dialog} />
      <Heading level={2}>수업 관리</Heading>
      <Text
        as='p'
        display='block'>
        초대 코드: {value.course.inviteCode}
      </Text>
      <Button onClick={() => setEditing(true)}>과제 만들기</Button>
      {value.course.role === 'teacher' && (
        <>
          <form
            className={styles.filters}
            onSubmit={(event) => {
              event.preventDefault();
              void member({ userId, role });
            }}>
            <div className={styles.field}>
              <Input
                label={contentLabel(<>추가할 계정 식별자</>)}
                required
                maxLength={128}
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
              />
            </div>
            <div className={styles.field}>
              <Select
                label={contentLabel(<>수업 역할</>)}
                value={role}
                onChange={(event) =>
                  setRole(event.target.value as typeof role)
                }>
                <option value='student'>수강생</option>
                <option value='assistant'>수업 조교</option>
              </Select>
            </div>
            <Button loading={busy}>구성원 저장</Button>
          </form>
          <Banner
            status='info'
            title='안내'>
            수업 조교는 이 수업의 과제를 관리합니다. 프로필의 커뮤니티 조교
            타이틀과 별도입니다.
          </Banner>
        </>
      )}
      {value.members.map(async (memberValue) => (
        <div
          className={styles.row}
          key={memberValue.userId}>
          <span>
            {memberValue.name ?? '학습자'} ·{' '}
            {memberValue.role === 'teacher'
              ? '개설자'
              : memberValue.role === 'assistant'
                ? '수업 조교'
                : '수강생'}
          </span>
          {value.course.role === 'teacher' &&
            memberValue.role !== 'teacher' && (
              <>
                <Select
                  aria-label={`${memberValue.name ?? '학습자'} 수업 역할`}
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
                  variant='danger'
                  disabled={busy}
                  onClick={async () => {
                    if (
                      await confirmation.confirm(
                        '이 구성원을 수업에서 제외할까요?'
                      )
                    )
                      void member({ remove: memberValue.userId });
                  }}>
                  제외
                </Button>
              </>
            )}
        </div>
      ))}
      {error && (
        <Banner
          status='error'
          title='확인이 필요해요'
          role='alert'>
          {error}
        </Banner>
      )}
      {editing && (
        <CourseAssignmentEditor
          courseId={value.course.id}
          language={value.course.language}
          onClose={() => setEditing(false)}
        />
      )}
    </Section>
  );
}
