import { useRefreshData } from '../../../-components/useRefreshData';
import { contentLabel } from '@/components/ui/primitives/contentLabel';
import { Banner } from '@/components/ui/composites/Banner';
import { useEffect, useState } from 'react';
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
import { SegmentedControl } from '@/components/ui/primitives/SegmentedControl';
import { SegmentedControlItem } from '@/components/ui/primitives/SegmentedControlItem';
import * as styles from './CourseAssignmentEditor.css';

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
  const refreshData = useRefreshData();

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
      width={600}
      title={assignment ? '과제 수정' : '과제 만들기'}
      onClose={() => {
        if (!busy) onClose();
      }}>
      <form
        className={styles.form}
        onSubmit={async (event) => {
          event.preventDefault();
          if (busy) return;
          const data = new FormData(event.currentTarget);
          const sourceId = String(data.get('sourceId') ?? '').trim();

          // Selector는 hidden input을 제출하므로 빈 자료 선택은 요청 전에 검사한다.
          if (!sourceId) {
            setError('과제에 사용할 자료를 선택해 주세요.');

            return;
          }

          setBusy(true);
          setError('');

          try {
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

            void refreshData();
            onClose();
          } catch (error) {
            setError((error as Error).message);
          } finally {
            setBusy(false);
          }
        }}>
        <fieldset
          className={styles.fields}
          disabled={busy}>
          <Input
            disabled={busy}
            label={contentLabel(<>과제 이름</>)}
            name='title'
            required
            maxLength={200}
            defaultValue={assignment?.title}
          />
          <div className={styles.field}>
            <span
              aria-hidden='true'
              className={styles.label}>
              자료 종류
            </span>
            <SegmentedControl
              label='자료 종류'
              value={kind}
              isDisabled={busy}
              onChange={(next) => {
                setKind(next as typeof kind);
                setPage(1);
              }}>
              <SegmentedControlItem
                value='video'
                label='영상'
              />
              <SegmentedControlItem
                value='pdf'
                label='PDF'
              />
            </SegmentedControl>
          </div>
          {kind === 'video' && (
            <Input
              disabled={busy}
              type='search'
              label={contentLabel(<>영상 검색</>)}
              value={q}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          )}
          <div className={styles.field}>
            <Select
              disabled={busy}
              label={contentLabel(<>자료</>)}
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
            {kind === 'video' && (
              <div className={styles.pager}>
                <Button
                  type='button'
                  variant='secondary'
                  className={styles.pagerButton}
                  disabled={busy || page <= 1}
                  onClick={() => setPage(page - 1)}>
                  이전 자료
                </Button>
                <Button
                  type='button'
                  variant='secondary'
                  className={styles.pagerButton}
                  disabled={busy || !hasMore}
                  onClick={() => setPage(page + 1)}>
                  다음 자료
                </Button>
              </div>
            )}
          </div>
          <div className={styles.pair}>
            <Input
              disabled={busy}
              label={contentLabel(
                <>시작 {kind === 'pdf' ? '페이지' : '구절'}</>
              )}
              type='number'
              name='from'
              min={1}
              required
              defaultValue={(assignment?.source.fromIndex ?? 0) + 1}
            />
            <Input
              disabled={busy}
              label={contentLabel(
                <>마지막 {kind === 'pdf' ? '페이지' : '구절'}</>
              )}
              type='number'
              name='to'
              min={1}
              required
              defaultValue={(assignment?.source.toIndex ?? 0) + 1}
            />
          </div>
          {kind === 'video' && (
            <div className={styles.pair}>
              <Select
                disabled={busy}
                label={contentLabel(<>풀이 방식</>)}
                name='mode'
                defaultValue={assignment?.mode ?? 'full'}>
                <option value='full'>전체 받아쓰기</option>
                <option value='blank'>빈칸 받아쓰기</option>
              </Select>
              <Select
                disabled={busy}
                label={contentLabel(<>빈칸 비율</>)}
                name='blankRatio'
                defaultValue={assignment?.source.blankRatio ?? 20}>
                <option value={20}>20%</option>
                <option value={40}>40%</option>
                <option value={60}>60%</option>
              </Select>
            </div>
          )}
          <Input
            disabled={busy}
            label={contentLabel(<>제출 기한</>)}
            type='datetime-local'
            name='dueAt'
            required
            defaultValue={localDate}
          />
          <fieldset className={styles.policies}>
            <legend className={styles.legend}>제출 정책</legend>
            {/* 새 과제는 시안 기본값대로 기한 후 제출만 막고 재제출, 힌트, 정답 공개를 허용한 채 시작한다. */}
            <Checkbox
              disabled={busy}
              label={contentLabel(<>기한 후 제출 허용</>)}
              variant='tile'
              name='allowLate'
              defaultChecked={assignment?.allowLate}
            />
            <Checkbox
              disabled={busy}
              label={contentLabel(<>재제출 허용</>)}
              variant='tile'
              name='allowResubmit'
              defaultChecked={assignment ? assignment.allowResubmit : true}
            />
            <Checkbox
              disabled={busy}
              label={contentLabel(<>힌트 허용</>)}
              variant='tile'
              name='allowHints'
              defaultChecked={assignment ? assignment.allowHints : true}
            />
            <Checkbox
              disabled={busy}
              label={contentLabel(<>제출 후 정답 공개</>)}
              variant='tile'
              name='revealAfterSubmit'
              defaultChecked={assignment ? assignment.revealAfterSubmit : true}
            />
          </fieldset>
          {assignment && (
            <Input
              disabled={busy}
              label={contentLabel(<>수정 이유</>)}
              name='reason'
              required
              maxLength={2000}
            />
          )}
        </fieldset>
        {error && (
          <Banner
            status='error'
            title='확인이 필요해요'
            role='alert'>
            {error}
          </Banner>
        )}
        <Button
          size='prominent'
          shape='rounded'
          className={styles.submit}
          disabled={busy}
          loading={busy}>
          과제 저장
        </Button>
      </form>
    </Dialog>
  );
}
