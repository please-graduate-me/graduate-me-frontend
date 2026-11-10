'use client';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../../../../_components/SessionRecovery';
import { useRef, useState } from 'react';
import type { Assignment } from '@/domains/courses/model/contracts';
import {
  getAssignment,
  getAssignmentHint,
  submitAssignment,
} from '@/domains/courses/api/courses';
import { Button } from '@/components/ui/primitives/Button';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { Input } from '@/components/ui/primitives/Input';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { Checkbox } from '@/components/ui/primitives/Checkbox';
import { Badge } from '@/components/ui/primitives/Badge';
import { formatDate } from '@/domains/learning/lib/format';
import * as styles from '@/lib/styles/workspace.css';
import * as assignmentStyles from './AssignmentStudy.css';

/** 개인 답안과 별개로 과제 당시 버전의 최종 제출과 이력을 보존한다. */
export function AssignmentStudy({
  initial,
  canSubmit,
}: {
  initial: Assignment;
  canSubmit: boolean;
}) {
  const [value, setValue] = useState(initial);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [confirmed, setConfirmed] = useState(false);
  const [hints, setHints] = useState<Record<string, string>>({});

  const [listeningTaskId, setListeningTaskId] = useState(
    initial.source.tasks[0]?.id
  );

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [message, setMessage] = useState('');
  const request = useRef<{ key: string; id: string } | null>(null);

  const blocked =
    !canSubmit ||
    value.sourceAvailable === false ||
    (!value.allowResubmit && value.submissions.length > 0);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (blocked || busy) return;
    setBusy(true);
    setError('');
    setMessage('');

    try {
      const input = value.source.tasks.map((task) => ({
        id: task.id,
        answer:
          answers[task.id] ??
          (value.mode === 'blank' ? task.blanks.map(() => '') : ''),
      }));

      const key = JSON.stringify([value.version, input]);

      if (request.current?.key !== key)
        request.current = { key, id: crypto.randomUUID() };

      const result = await submitAssignment(value.courseId, value.id, {
        requestId: request.current.id,
        version: value.version,
        answers: input,
      });

      request.current = null;

      setValue((previous) => ({
        ...previous,
        submissions: [
          result,
          ...previous.submissions.filter((item) => item.id !== result.id),
        ],
      }));

      setMessage(
        result.late
          ? '기한 후 제출을 저장했습니다.'
          : '과제 제출을 저장했습니다. 개인 학습 진도는 변경하지 않습니다.'
      );
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function hint(taskId: string) {
    setBusy(true);
    setError('');

    try {
      const result = await getAssignmentHint(
        value.courseId,
        value.id,
        value.version,
        taskId
      );

      setHints((previous) => ({ ...previous, [taskId]: result.hint }));
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function refresh() {
    setBusy(true);
    setError('');

    try {
      const result = await getAssignment(value.courseId, value.id);

      if (result.version !== value.version) {
        setAnswers({});
        setConfirmed(false);

        setMessage(
          '과제가 변경되어 현재 버전을 불러왔습니다. 이전 제출은 이력에서 확인하세요.'
        );
      }

      setValue(result);
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.page}>
      <ButtonLink
        href={`/courses/${encodeURIComponent(value.courseId)}`}
        variant='ghost'>
        ← 수업 과제
      </ButtonLink>
      <div className={styles.heading}>
        <div>
          <h1>{value.title}</h1>
          <p>
            과제 v{value.version} · 원본 v{value.source.version} ·{' '}
            {value.source.title}
          </p>
        </div>
        <Button
          variant='secondary'
          disabled={busy}
          onClick={() => void refresh()}>
          현재 상태 확인
        </Button>
      </div>
      <p className={styles.notice}>
        기한 {formatDate(value.dueAt)} · 기한 후 제출{' '}
        {value.allowLate ? '허용' : '불가'} · 재제출{' '}
        {value.allowResubmit ? '허용' : '불가'} · 제출 후 정답{' '}
        {value.revealAfterSubmit ? '공개' : '비공개'} · 힌트{' '}
        {value.allowHints ? '허용' : '불가'}
      </p>
      {sessionExpired && <SessionRecovery />}
      {value.sourceAvailable === false && (
        <p className={styles.notice}>
          원본이 삭제되었거나 현재 열람 권한이 없습니다. 새 학습·제출·힌트는
          중지하며 본인의 과거 제출과 변경 이력은 계속 확인할 수 있습니다.
        </p>
      )}
      {error && (
        <p
          className={styles.error}
          role='alert'>
          {error}
        </p>
      )}
      {message && (
        <p
          className={styles.notice}
          role='status'>
          {message}
        </p>
      )}
      <form
        className={styles.stack}
        onSubmit={(event) => void submit(event)}>
        {value.source.tasks.map((task, index) => (
          <section
            className={styles.panel}
            key={task.id}>
            <h2>
              {index + 1}.{' '}
              {value.mode === 'reading'
                ? `${task.page}페이지 읽기`
                : `${task.start?.toFixed(1)}초 ~ ${task.end?.toFixed(1)}초`}
            </h2>
            {value.source.kind === 'video' &&
              value.source.youtubeId &&
              listeningTaskId === task.id && (
                <iframe
                  className={assignmentStyles.player}
                  src={`https://www.youtube.com/embed/${encodeURIComponent(value.source.youtubeId)}?start=${Math.floor(task.start ?? 0)}&end=${Math.ceil(task.end ?? 0)}`}
                  title={`${index + 1}번 과제 원본 영상`}
                  allow='encrypted-media; picture-in-picture'
                  allowFullScreen
                />
              )}
            {value.source.kind === 'video' && (
              <Button
                type='button'
                variant='secondary'
                onClick={() => setListeningTaskId(task.id)}>
                이 구절 음성 듣기
              </Button>
            )}
            {value.allowHints &&
              canSubmit &&
              value.sourceAvailable !== false && (
                <Button
                  type='button'
                  variant='ghost'
                  disabled={busy}
                  onClick={() => void hint(task.id)}>
                  힌트 확인 · 사용 기록됨
                </Button>
              )}
            {hints[task.id] && (
              <p className={styles.notice}>{hints[task.id]}</p>
            )}
            {value.mode === 'reading' && (
              <>
                <blockquote className={styles.quote}>{task.text}</blockquote>
                <ButtonLink
                  href={`/materials/${encodeURIComponent(value.source.id)}?page=${task.page}&version=${task.version}`}
                  variant='ghost'>
                  원본 PDF 페이지 열기 ↗
                </ButtonLink>
              </>
            )}
            {value.mode === 'blank' ? (
              <div className={styles.row}>
                {task.units.map((unit, position) =>
                  unit === null ? (
                    <Input
                      key={position}
                      aria-label={`${index + 1}번 구절 ${task.blanks.indexOf(position) + 1}번 빈칸`}
                      disabled={blocked || busy}
                      required
                      value={
                        Array.isArray(answers[task.id])
                          ? (answers[task.id][task.blanks.indexOf(position)] ??
                            '')
                          : ''
                      }
                      onChange={(event) => {
                        const next = Array.isArray(answers[task.id])
                          ? [...answers[task.id]]
                          : task.blanks.map(() => '');

                        next[task.blanks.indexOf(position)] =
                          event.target.value;

                        setAnswers((previous) => ({
                          ...previous,
                          [task.id]: next,
                        }));
                      }}
                    />
                  ) : (
                    <span key={position}>{unit} </span>
                  )
                )}
              </div>
            ) : (
              <label className={styles.field}>
                {value.mode === 'reading'
                  ? '읽고 이해한 내용'
                  : '들은 전체 문장'}
                <TextArea
                  disabled={blocked || busy}
                  required
                  maxLength={10000}
                  value={
                    typeof answers[task.id] === 'string' ? answers[task.id] : ''
                  }
                  onChange={(event) =>
                    setAnswers((previous) => ({
                      ...previous,
                      [task.id]: event.target.value,
                    }))
                  }
                />
              </label>
            )}
          </section>
        ))}
        {canSubmit && (
          <>
            <label className={styles.row}>
              <Checkbox
                checked={confirmed}
                disabled={busy || blocked}
                onChange={(event) => setConfirmed(event.target.checked)}
              />
              과제 v{value.version}의 답안을 수업 담당자에게 제출하는 데
              동의합니다.
            </label>
            <Button
              disabled={blocked || busy || !confirmed}
              loading={busy}>
              과제 최종 제출
            </Button>
          </>
        )}
      </form>
      <section>
        <h2>제출 이력</h2>
        {!value.submissions.length && <p>아직 제출한 기록이 없습니다.</p>}
        {value.submissions.map((item) => (
          <article
            className={styles.message}
            key={item.id}>
            <Badge tone={item.late ? 'warning' : 'success'}>
              {item.late ? '기한 후 제출' : '제출 완료'} · 과제 v{item.version}
            </Badge>
            <p>
              {item.studentName ?? '내 제출'} · {formatDate(item.createdAt)} ·
              힌트 {item.hintCount ?? 0}회
            </p>
            {item.answers.map((answer, index) => (
              <div key={answer.id}>
                <h3>{index + 1}번 답안</h3>
                <p className={styles.prose}>
                  {Array.isArray(answer.answer)
                    ? answer.answer.join(' / ')
                    : answer.answer}
                </p>
                <p>
                  {item.result.find((result) => result.id === answer.id)
                    ?.correct === true
                    ? '정답'
                    : item.result.find((result) => result.id === answer.id)
                          ?.correct === false
                      ? '다시 확인'
                      : '읽기 제출 · 자동 성적 없음'}
                </p>
                {item.result.find((result) => result.id === answer.id)
                  ?.expected !== undefined && (
                  <p>
                    당시 정답:{' '}
                    {JSON.stringify(
                      item.result.find((result) => result.id === answer.id)
                        ?.expected
                    )}
                  </p>
                )}
              </div>
            ))}
          </article>
        ))}
      </section>
      <details>
        <summary>과제 변경 이력</summary>
        {value.revisions.map((item) => (
          <p key={item.version}>
            v{item.version} · {item.reason} · {formatDate(item.createdAt)}
          </p>
        ))}
      </details>
    </div>
  );
}
