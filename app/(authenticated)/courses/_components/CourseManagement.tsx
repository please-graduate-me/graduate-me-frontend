'use client';
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
    <section className={styles.stack}>
      <h2>수업 관리</h2>
      <p>초대 코드: {value.course.inviteCode}</p>
      <Button onClick={() => setEditing(true)}>과제 만들기</Button>
      {value.course.role === 'teacher' && (
        <>
          <form
            className={styles.filters}
            onSubmit={(event) => {
              event.preventDefault();
              void member({ userId, role });
            }}>
            <label className={styles.field}>
              추가할 계정 식별자
              <Input
                required
                maxLength={128}
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
              />
            </label>
            <label className={styles.field}>
              수업 역할
              <Select
                value={role}
                onChange={(event) =>
                  setRole(event.target.value as typeof role)
                }>
                <option value='student'>수강생</option>
                <option value='assistant'>수업 조교</option>
              </Select>
            </label>
            <Button loading={busy}>구성원 저장</Button>
          </form>
          <p className={styles.notice}>
            수업 조교는 이 수업의 과제를 관리합니다. 프로필의 커뮤니티 조교
            타이틀과 별도입니다.
          </p>
        </>
      )}
      {value.members.map((memberValue) => (
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
                  onClick={() => {
                    if (window.confirm('이 구성원을 수업에서 제외할까요?'))
                      void member({ remove: memberValue.userId });
                  }}>
                  제외
                </Button>
              </>
            )}
        </div>
      ))}
      {error && (
        <p
          role='alert'
          className={styles.error}>
          {error}
        </p>
      )}
      {editing && (
        <CourseAssignmentEditor
          courseId={value.course.id}
          language={value.course.language}
          onClose={() => setEditing(false)}
        />
      )}
    </section>
  );
}
