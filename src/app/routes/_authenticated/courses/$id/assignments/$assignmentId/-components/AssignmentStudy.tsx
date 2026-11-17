import { contentLabel } from '@/components/ui/primitives/contentLabel';
import { Banner } from '@/components/ui/composites/Banner';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { Card } from '@/components/ui/primitives/Card';
import { Collapsible } from '@/components/ui/composites/Collapsible';
import { ProgressBar } from '@/components/ui/primitives/ProgressBar';
import { Icon } from '@/components/ui/primitives/Icon';
import { CourseAssignmentEditor } from '../../../../-components/CourseAssignmentEditor';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../../../../-components/SessionRecovery';
import { GraduationStamp } from '../../../../../../-components/GraduationStamp';
import { useId, useRef, useState } from 'react';
import {
  archiveAssignmentDraft,
  type AssignmentDraft,
} from '@/domains/courses/lib/drafts';
import type { Assignment } from '@/domains/courses/model/contracts';
import {
  getAssignment,
  getAssignmentHint,
  submitAssignment,
} from '@/domains/courses/api/courses';
import { Button } from '@/components/ui/primitives/Button';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { Input } from '@/components/ui/primitives/Input';
import { Checkbox } from '@/components/ui/primitives/Checkbox';
import { Badge } from '@/components/ui/primitives/Badge';
import { formatDate } from '@/domains/learning/lib/format';
import { RelativeTime } from '@/components/ui/primitives/RelativeTime';
import { AssignmentTask } from './AssignmentTask';
import { AssignmentSubmission } from './AssignmentSubmission';
import * as styles from './AssignmentStudy.css';

const modes = {
  reading: '읽기',
  full: '전체 받아쓰기',
  blank: '빈칸 받아쓰기',
} as const;

/** 빈칸은 모두, 문장 답안은 공백이 아닌 글자가 있어야 채운 구절로 본다. */
function isFilled(
  task: Assignment['source']['tasks'][number],
  answer: string | string[] | undefined
) {
  if (Array.isArray(answer))
    return (
      answer.length === task.blanks.length &&
      answer.every((item) => item.trim() !== '')
    );

  return typeof answer === 'string' && answer.trim() !== '';
}

const hintsByTask = (assignment: Assignment) =>
  Object.fromEntries(assignment.hints.map((item) => [item.taskId, item.hint]));

/** 개인 답안과 별개로 과제 당시 버전의 최종 제출과 이력을 보존한다. */
export function AssignmentStudy({
  initial,
  canSubmit,
}: {
  initial: Assignment;
  canSubmit: boolean;
}) {
  const formId = useId();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initial);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [confirmed, setConfirmed] = useState(false);
  const [previousDrafts, setPreviousDrafts] = useState<AssignmentDraft[]>([]);
  // 이미 받은 힌트는 서버 기록으로 복원해 새로고침 뒤 다시 요청하며 사용 횟수가 늘지 않게 한다.
  const [hints, setHints] = useState(() => hintsByTask(initial));
  const [step, setStep] = useState(0);

  const [listeningTaskId, setListeningTaskId] = useState(
    initial.source.tasks[0]?.id
  );

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [message, setMessage] = useState('');

  const [submitted, setSubmitted] = useState<{
    id: string;
    late: boolean;
  } | null>(null);

  const request = useRef<{ key: string; id: string } | null>(null);

  const blocked =
    !canSubmit ||
    value.sourceAvailable === false ||
    (!value.allowResubmit && value.submissions.length > 0);

  const tasks = value.source.tasks;
  const unit = value.mode === 'reading' ? '페이지' : '구절';
  const current = Math.min(step, Math.max(tasks.length - 1, 0));

  const filled = tasks.map((task) => isFilled(task, answers[task.id]));
  const doneCount = filled.filter(Boolean).length;

  const canHint =
    value.allowHints && canSubmit && value.sourceAvailable !== false;

  function answer(taskId: string, next: string | string[]) {
    setAnswers((previous) => ({ ...previous, [taskId]: next }));
    // 답안을 다시 고치면 재제출 흐름이므로 완료 시트를 내리고 제출 막대를 되돌린다.
    setSubmitted(null);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (blocked || busy || !confirmed) return;
    const missing = filled.indexOf(false);

    // 한 번에 한 구절만 보이므로 숨은 빈 답안은 브라우저 검사 대신 직접 찾아 보여 준다.
    if (missing >= 0) {
      setStep(missing);
      setError(`모든 ${unit}의 답을 채워 주세요.`);

      return;
    }

    setBusy(true);
    setError('');
    setMessage('');

    try {
      const input = tasks.map((task) => ({
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

      setSubmitted({ id: result.id, late: result.late });
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

      if (
        result.version !== value.version ||
        (result.sourceAvailable === false && value.sourceAvailable !== false)
      ) {
        const draft = archiveAssignmentDraft(value, answers);

        // 새 버전 답안에 섞지 않고 당시 입력을 따로 보관해 조용한 손실을 막는다.
        if (draft) setPreviousDrafts((previous) => [draft, ...previous]);
        setAnswers({});
        setConfirmed(false);
        setStep(0);
        setSubmitted(null);

        setMessage(
          result.sourceAvailable === false
            ? '원본 접근이 변경되어 새 학습을 중지했습니다. 작성한 초안은 별도로 보관했습니다.'
            : '과제가 변경되어 현재 버전을 불러왔습니다. 이전 초안과 제출은 별도로 보관합니다.'
        );
      }

      setValue(result);
      setHints(hintsByTask(result));
    } catch (error) {
      setSessionExpired(error instanceof ApiError && error.status === 401);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const task = tasks[current];

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <ButtonLink
          href={`/courses/${encodeURIComponent(value.courseId)}`}
          variant='ghost'
          aria-label='수업 과제로 돌아가기'
          className={styles.close}>
          <Icon
            name='x'
            size={22}
          />
        </ButtonLink>
        {canSubmit && tasks.length > 0 ? (
          <ProgressBar
            label={`답을 채운 ${unit}`}
            isLabelHidden
            value={doneCount}
            max={tasks.length}
            className={styles.progress}
          />
        ) : (
          <span className={styles.spacer} />
        )}
        <div className={styles.headerActions}>
          {!canSubmit && (
            <Button
              type='button'
              variant='ink'
              onClick={() => setEditing(true)}>
              <Icon
                name='pencil'
                size={16}
              />
              과제 수정
            </Button>
          )}
          <Button
            type='button'
            variant='soft'
            disabled={busy}
            startIcon='rotate-ccw'
            onClick={() => void refresh()}>
            현재 상태 확인
          </Button>
        </div>
      </header>
      {editing && (
        <CourseAssignmentEditor
          courseId={value.courseId}
          language={value.source.language}
          assignment={value}
          onClose={() => {
            setEditing(false);
            void refresh();
          }}
        />
      )}
      <main className={styles.main}>
        <div className={styles.intro}>
          <Badge
            tone='review'
            className={styles.kind}>
            {modes[value.mode]} · {tasks.length}
            {unit}
          </Badge>
          <Heading
            level={1}
            className={styles.title}>
            {value.title}
          </Heading>
          <p className={styles.meta}>
            과제 v{value.version} · 원본 v{value.source.version} ·{' '}
            {value.source.title}
          </p>
          <ul
            aria-label='제출 조건'
            className={styles.conditions}>
            <li className={`${styles.condition} ${styles.due}`}>
              <Icon
                name='clock'
                size={14}
              />
              기한 {formatDate(value.dueAt)}
            </li>
            <li className={styles.condition}>
              기한 후 제출 {value.allowLate ? '허용' : '불가'}
            </li>
            <li className={styles.condition}>
              재제출 {value.allowResubmit ? '허용' : '불가'}
            </li>
            <li className={styles.condition}>
              제출 후 정답 {value.revealAfterSubmit ? '공개' : '비공개'}
            </li>
            <li className={styles.condition}>
              힌트 {value.allowHints ? '허용' : '불가'}
            </li>
          </ul>
        </div>
        {sessionExpired && <SessionRecovery />}
        {value.sourceAvailable === false && (
          <Banner
            status='quote'
            icon='info'>
            원본이 삭제되었거나 현재 열람 권한이 없습니다. 새 학습·제출·힌트는
            중지하며 본인의 과거 제출과 변경 이력은 계속 확인할 수 있습니다.
          </Banner>
        )}
        {error && (
          <Banner
            status='error'
            icon='circle-alert'
            title='확인이 필요해요'
            role='alert'>
            {error}
          </Banner>
        )}
        {message && (
          <Banner
            status='info'
            icon='info'
            role='status'
            className={styles.notice}>
            {message}
          </Banner>
        )}
        <form
          id={formId}
          noValidate
          className={styles.form}
          onSubmit={(event) => void submit(event)}>
          {task && (
            <AssignmentTask
              key={`${value.version}:${task.id}`}
              value={value}
              task={task}
              index={current}
              answer={answers[task.id]}
              onAnswer={(next) => answer(task.id, next)}
              disabled={blocked || busy}
              listening={listeningTaskId === task.id}
              onListen={() => setListeningTaskId(task.id)}
              hint={hints[task.id]}
              onHint={() => void hint(task.id)}
              canHint={canHint}
              busy={busy}
            />
          )}
        </form>
        {tasks.length > 1 && (
          <nav
            aria-label={`${unit} 이동`}
            className={styles.steps}>
            <Button
              type='button'
              variant='secondary'
              disabled={current === 0}
              onClick={() => setStep(current - 1)}>
              이전 {unit}
            </Button>
            <div className={styles.dots}>
              {tasks.map((item, index) => (
                <Button
                  key={item.id}
                  type='button'
                  variant={
                    index === current
                      ? 'ink'
                      : filled[index]
                        ? 'success-outline'
                        : 'secondary'
                  }
                  className={styles.dot}
                  aria-label={`${index + 1}번 ${unit}${filled[index] ? ' · 답 채움' : ''}`}
                  aria-current={index === current ? 'step' : undefined}
                  onClick={() => setStep(index)}>
                  {index + 1}
                </Button>
              ))}
            </div>
            <Button
              type='button'
              variant='secondary'
              disabled={current === tasks.length - 1}
              onClick={() => setStep(current + 1)}>
              다음 {unit}
            </Button>
          </nav>
        )}
        {previousDrafts.map((draft, index) => (
          <section
            aria-label={`이전 과제 v${draft.version} 미제출 초안`}
            className={styles.draft}
            key={`${draft.version}:${index}`}>
            <Heading
              level={2}
              className={styles.draftTitle}>
              이전 과제 v{draft.version} · 미제출 초안
            </Heading>
            <Text
              as='p'
              display='block'
              size='sm'
              color='secondary'>
              과제 변경 전에 작성한 내용입니다. 새 버전의 제출 답안으로 자동
              사용하지 않습니다.
            </Text>
            {draft.answers.map((answer, position) => (
              <Input
                key={position}
                label={contentLabel(<>{answer.label}</>)}
                readOnly
                isNumeric
                value={
                  Array.isArray(answer.answer)
                    ? answer.answer.join(' / ')
                    : answer.answer
                }
              />
            ))}
          </section>
        ))}
        <section
          id='history'
          aria-labelledby='assignment-history'
          className={styles.history}>
          <Heading
            level={2}
            id='assignment-history'
            className={styles.sectionTitle}>
            제출 이력
          </Heading>
          {!value.submissions.length && (
            <Text
              as='p'
              display='block'
              size='sm'
              color='secondary'>
              아직 제출한 기록이 없습니다.
            </Text>
          )}
          {value.submissions.map((item) => (
            <AssignmentSubmission
              key={item.id}
              item={item}
              fresh={item.id === submitted?.id}
            />
          ))}
        </section>
        <Card className={styles.revisions}>
          <Collapsible trigger={<>과제 변경 이력</>}>
            <ol className={styles.revisionList}>
              {value.revisions.map((item) => (
                <li
                  className={styles.revision}
                  key={item.version}>
                  <span className={styles.revisionVersion}>
                    v{item.version}
                  </span>
                  <span className={styles.revisionReason}>{item.reason}</span>
                  <RelativeTime
                    value={item.createdAt}
                    className={styles.revisionTime}
                  />
                </li>
              ))}
            </ol>
          </Collapsible>
        </Card>
      </main>
      {canSubmit && (
        <div className={styles.dock}>
          {submitted ? (
            <div
              role='status'
              className={styles.sheet}>
              <div className={styles.sheetInner}>
                <GraduationStamp size={68} />
                <div className={styles.sheetText}>
                  <p className={styles.sheetTitle}>
                    {submitted.late
                      ? '기한 후 제출을 저장했습니다.'
                      : '과제 제출을 저장했습니다.'}
                  </p>
                  <p className={styles.sheetBody}>
                    개인 학습 진도는 변경하지 않습니다.
                  </p>
                </div>
                <ButtonLink
                  href='#history'
                  variant='success-outline'
                  size='prominent'>
                  제출 이력 보기
                </ButtonLink>
                <ButtonLink
                  href={`/courses/${encodeURIComponent(value.courseId)}`}
                  size='prominent'>
                  수업으로 돌아가기
                </ButtonLink>
              </div>
            </div>
          ) : (
            <div className={styles.bar}>
              <div className={styles.barInner}>
                <Checkbox
                  className={styles.consent}
                  label={contentLabel(
                    <>
                      과제 v{value.version}의 답안을 수업 담당자에게 제출하는 데
                      동의합니다.
                    </>
                  )}
                  checked={confirmed}
                  disabled={busy || blocked}
                  onChange={(event) => setConfirmed(event.target.checked)}
                />
                <Button
                  form={formId}
                  variant='ink'
                  size='prominent'
                  className={styles.submit}
                  disabled={blocked || busy || !confirmed}
                  loading={busy}>
                  과제 최종 제출
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
