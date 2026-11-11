'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Assignment } from '@/domains/courses/model/contracts';
import {
  listAssignmentSources,
  saveCourseAssignment,
} from '@/domains/courses/api/courses';
import { Dialog } from '@/components/ui/composites/Dialog';
import { Input } from '@/components/ui/primitives/Input';
import { Select } from '@/components/ui/primitives/Select';
import { Checkbox } from '@/components/ui/primitives/Checkbox';
import { Button } from '@/components/ui/primitives/Button';
import * as styles from '@/lib/styles/workspace.css';

/** 과제 원본과 제출 정책은 버전으로 보존하고 학생 화면과 같은 자료를 선택한다. */
export function CourseAssignmentEditor({
  courseId,
  language,
  assignment,
  onClose,
}: {
  courseId: string;
  language: 'en' | 'th';
  assignment?: Assignment;
  onClose: () => void;
}) {
  const router = useRouter();

  const [kind, setKind] = useState<'pdf' | 'video'>(
    assignment?.source.kind ?? 'video'
  );

  const [sources, setSources] = useState<
    { id: string; title: string; language: 'en' | 'th' }[]
  >([]);

  const [q, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;

    void listAssignmentSources(kind, language, q, page)
      .then((result) => {
        if (active) {
          setSources(result.items.filter((item) => item.language === language));
          setHasMore(result.hasMore ?? false);
        }
      })
      .catch((error) => {
        if (active) setError(error.message);
      });

    return () => {
      active = false;
    };
  }, [kind, language, q, page]);

  const [initialDate] = useState(
    () => new Date(assignment?.dueAt ?? Date.now() + 7 * 86400000)
  );

  const localDate = new Date(
    initialDate.getTime() - initialDate.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16);

  return (
    <Dialog
      open
      title={assignment ? '과제 수정' : '과제 만들기'}
      onClose={() => {
        if (!busy) onClose();
      }}>
      <form
        className={styles.stack}
        onSubmit={async (event) => {
          event.preventDefault();
          if (busy) return;
          const data = new FormData(event.currentTarget);

          setBusy(true);
          setError('');

          try {
            const sourceId = String(data.get('sourceId'));

            await saveCourseAssignment(
              courseId,
              {
                title: String(data.get('title')),
                ...(kind === 'pdf'
                  ? { materialId: sourceId }
                  : { videoId: sourceId }),
                fromIndex: Number(data.get('from')) - 1,
                toIndex: Number(data.get('to')) - 1,
                mode:
                  kind === 'pdf'
                    ? 'reading'
                    : (data.get('mode') as 'full' | 'blank'),
                blankRatio: Number(data.get('blankRatio') ?? 20) as
                  20 | 40 | 60,
                dueAt: new Date(String(data.get('dueAt'))).toISOString(),
                allowLate: data.has('allowLate'),
                allowResubmit: data.has('allowResubmit'),
                allowHints: data.has('allowHints'),
                revealAfterSubmit: data.has('revealAfterSubmit'),
                ...(assignment
                  ? {
                      expectedVersion: assignment.version,
                      reason: String(data.get('reason')),
                    }
                  : {}),
              },
              assignment?.id
            );

            router.refresh();
            onClose();
          } catch (error) {
            setError((error as Error).message);
          } finally {
            setBusy(false);
          }
        }}>
        <fieldset
          className={styles.stack}
          disabled={busy}>
          <label className={styles.field}>
            과제 이름
            <Input
              name='title'
              required
              maxLength={200}
              defaultValue={assignment?.title}
            />
          </label>
          <label className={styles.field}>
            자료 종류
            <Select
              value={kind}
              onChange={(event) => {
                setKind(event.target.value as typeof kind);
                setPage(1);
              }}>
              <option value='video'>영상</option>
              <option value='pdf'>PDF</option>
            </Select>
          </label>
          {kind === 'video' && (
            <label className={styles.field}>
              영상 검색
              <Input
                value={q}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            </label>
          )}
          <label className={styles.field}>
            자료
            <Select
              name='sourceId'
              required
              defaultValue={assignment?.source.id}
              key={kind}>
              <option value=''>자료를 선택해 주세요</option>
              {assignment?.source.kind === kind &&
                !sources.some(
                  (source) => source.id === assignment.source.id
                ) && (
                  <option value={assignment.source.id}>
                    {assignment.source.title}
                  </option>
                )}
              {sources.map((source) => (
                <option
                  key={source.id}
                  value={source.id}>
                  {source.title}
                </option>
              ))}
            </Select>
          </label>
          {kind === 'video' && (
            <div className={styles.row}>
              <Button
                type='button'
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}>
                이전 자료
              </Button>
              <Button
                type='button'
                disabled={!hasMore}
                onClick={() => setPage(page + 1)}>
                다음 자료
              </Button>
            </div>
          )}
          <label className={styles.field}>
            시작 {kind === 'pdf' ? '페이지' : '구절'}
            <Input
              type='number'
              name='from'
              min={1}
              required
              defaultValue={(assignment?.source.fromIndex ?? 0) + 1}
            />
          </label>
          <label className={styles.field}>
            마지막 {kind === 'pdf' ? '페이지' : '구절'}
            <Input
              type='number'
              name='to'
              min={1}
              required
              defaultValue={(assignment?.source.toIndex ?? 0) + 1}
            />
          </label>
          {kind === 'video' && (
            <>
              <label className={styles.field}>
                풀이 방식
                <Select
                  name='mode'
                  defaultValue={assignment?.mode ?? 'full'}>
                  <option value='full'>전체 받아쓰기</option>
                  <option value='blank'>빈칸 받아쓰기</option>
                </Select>
              </label>
              <label className={styles.field}>
                빈칸 비율
                <Select
                  name='blankRatio'
                  defaultValue={assignment?.source.blankRatio ?? 20}>
                  <option value={20}>20%</option>
                  <option value={40}>40%</option>
                  <option value={60}>60%</option>
                </Select>
              </label>
            </>
          )}
          <label className={styles.field}>
            제출 기한
            <Input
              type='datetime-local'
              name='dueAt'
              required
              defaultValue={localDate}
            />
          </label>
          <label>
            <Checkbox
              name='allowLate'
              defaultChecked={assignment?.allowLate}
            />{' '}
            기한 후 제출 허용
          </label>
          <label>
            <Checkbox
              name='allowResubmit'
              defaultChecked={assignment?.allowResubmit}
            />{' '}
            재제출 허용
          </label>
          <label>
            <Checkbox
              name='allowHints'
              defaultChecked={assignment?.allowHints}
            />{' '}
            힌트 허용
          </label>
          <label>
            <Checkbox
              name='revealAfterSubmit'
              defaultChecked={assignment?.revealAfterSubmit}
            />{' '}
            제출 후 정답 공개
          </label>
          {assignment && (
            <label className={styles.field}>
              수정 이유
              <Input
                name='reason'
                required
                maxLength={2000}
              />
            </label>
          )}
        </fieldset>
        {error && (
          <p
            role='alert'
            className={styles.error}>
            {error}
          </p>
        )}
        <Button loading={busy}>과제 저장</Button>
      </form>
    </Dialog>
  );
}
