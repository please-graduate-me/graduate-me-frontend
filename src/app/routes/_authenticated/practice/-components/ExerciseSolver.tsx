import { contentLabel } from '@/components/ui/primitives/contentLabel';
import { Blockquote } from '@/components/ui/primitives/Blockquote';
import { Banner } from '@/components/ui/composites/Banner';
import { Text } from '@/components/ui/primitives/Text';
import { Heading } from '@/components/ui/primitives/Heading';
import { Card } from '@/components/ui/primitives/Card';
import { notifyLearningReward } from '@/domains/growth/lib/rewardEvents';
import { aiProviderLabel } from '@/domains/ai/lib/providerLabel';
import { useEffect, useRef, useState } from 'react';
import { Link } from '@/components/ui/primitives/Link';
import type { Exercise, ExerciseResult } from '@/domains/ai/model/contracts';
import {
  answerExercise,
  revealExerciseAnswer,
  revealExerciseHint,
  updateExerciseState,
} from '@/domains/ai/api/learning';
import { materialPaths } from '@/domains/materials/config/paths';
import { sourceLabel } from '@/domains/learning/lib/format';
import { RadioList } from '@/components/ui/primitives/RadioList';
import { RadioListItem } from '@/components/ui/primitives/RadioListItem';
import { Button } from '@/components/ui/primitives/Button';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from '../../../-components/SessionRecovery';
import { QuestionComposer } from '../../../-components/QuestionComposer';
import { ExerciseAttempts } from './ExerciseAttempts';
import * as styles from './ExerciseSolver.css';

/** 저장 정답 채점과 자유 답변 AI 피드백을 분리하고 도움 사용을 보존한다. */
export function ExerciseSolver({
  exercise,
  onChange,
}: {
  exercise: Exercise;
  onChange: (value: Exercise) => void;
}) {
  const [answer, setAnswer] = useState(exercise.state.draft);
  const [hint, setHint] = useState('');

  const [revealed, setRevealed] = useState<{
    answer: string;
    explanation: string;
  } | null>(null);

  const [result, setResult] = useState<ExerciseResult | null>(
    exercise.latestResult?.version === exercise.version
      ? exercise.latestResult
      : null
  );

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [report, setReport] = useState(false);
  const [reload, setReload] = useState(0);
  const [saveStatus, setSaveStatus] = useState('저장된 답안 복원');
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const lastSaved = useRef(exercise.state.draft);
  const currentAnswer = useRef(answer);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const request = useRef<{ answer: string; id: string } | null>(null);

  const disabled =
    busy ||
    exercise.status === 'suspended' ||
    exercise.needsReview ||
    exercise.state.excluded;

  async function flushDraft(value: string) {
    clearTimeout(timer.current);
    if (lastSaved.current === value) return;

    const task = queue.current
      .catch(() => undefined)
      .then(() =>
        updateExerciseState(exercise.id, {
          version: exercise.version,
          draft: value,
        })
      );

    queue.current = task;
    await task;
    lastSaved.current = value;
    setSaveStatus('답안 저장됨');
  }

  useEffect(
    () => () => {
      clearTimeout(timer.current);
      const value = currentAnswer.current;

      // 문제를 바꾸는 순간의 마지막 입력도 기존 저장 요청 뒤에 보존한다.
      if (lastSaved.current !== value)
        void queue.current
          .catch(() => undefined)
          .then(() =>
            updateExerciseState(exercise.id, {
              version: exercise.version,
              draft: value,
            })
          )
          .catch(() => undefined);
    },
    [exercise.id, exercise.version]
  );

  function change(value: string) {
    currentAnswer.current = value;
    setAnswer(value);
    setSaveStatus('저장 중…');
    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      void flushDraft(value).catch((error) => {
        setSaveStatus('저장 실패');
        setError(error.message);
      });
    }, 500);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!answer.trim() || disabled) return;
    setBusy(true);
    setError('');

    try {
      await flushDraft(answer);
      if (!request.current || request.current.answer !== answer)
        request.current = { answer, id: crypto.randomUUID() };

      const value = await answerExercise(exercise.id, {
        requestId: request.current.id,
        version: exercise.version,
        answer,
      });

      setSessionExpired(false);
      notifyLearningReward(value.reward);
      setResult(value);
      request.current = null;
      setReload((value) => value + 1);

      onChange({
        ...exercise,
        latestResult: value,
        state: {
          ...exercise.state,
          draft: answer,
          hintUsed: value.hintUsed,
          revealed: value.revealed,
        },
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401)
        setSessionExpired(true);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function hintOrReveal(kind: 'hint' | 'reveal') {
    if (disabled) return;
    setBusy(true);
    setError('');

    try {
      await flushDraft(answer);

      if (kind === 'hint') {
        const value = await revealExerciseHint(exercise.id, exercise.version);

        setHint(value.hint);
        onChange({ ...exercise, state: value.state });
      } else {
        const value = await revealExerciseAnswer(exercise.id, exercise.version);

        setRevealed(value);
        onChange({ ...exercise, state: value.state });
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401)
        setSessionExpired(true);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function exclude() {
    setBusy(true);
    setError('');

    try {
      if (exercise.status !== 'suspended' && !exercise.needsReview)
        await flushDraft(answer);

      onChange(
        await updateExerciseState(exercise.id, {
          version: exercise.version,
          excluded: !exercise.state.excluded,
        })
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 401)
        setSessionExpired(true);
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card
      as='section'
      aria-labelledby={`exercise-${exercise.id}-question`}
      className={styles.root}>
      {sessionExpired && <SessionRecovery />}
      {exercise.payload.practiceStyle === 'flex' && (
        <Banner
          status='note'
          icon='info'
          layout='inline'
          title='안내'>
          문맥 이해를 위한 FLEX형 연습입니다. 실제 시험 점수나 공인 수준으로
          환산하지 않습니다.
          {exercise.payload.skill === 'listening' && (
            <Link href={materialPaths.source(exercise.source)}>
              {' '}
              영상 원문 구절 듣기 ↗
            </Link>
          )}
        </Banner>
      )}
      <div className={styles.badges}>
        <Badge tone='review'>
          AI 생성 ·{' '}
          {exercise.payload.practiceStyle === 'flex'
            ? `FLEX형 ${exercise.payload.skill === 'listening' ? '듣기' : '읽기'} · `
            : ''}{' '}
          {exercise.payload.type === 'choice'
            ? '객관식'
            : exercise.payload.type === 'short_answer'
              ? '정답형'
              : '자유답변'}
        </Badge>
        <Text
          color='secondary'
          className={styles.meta}>
          문제 v{exercise.version} · {aiProviderLabel(exercise.provider)} ·{' '}
          {exercise.model}
        </Text>
        <Badge
          className={styles.review}
          tone={
            exercise.needsReview
              ? 'warning'
              : exercise.reviewStatus === 'verified'
                ? 'success'
                : 'neutral'
          }>
          {exercise.needsReview
            ? '수정 후 확인 필요'
            : exercise.reviewStatus === 'verified'
              ? '이 문제·버전 검토 완료'
              : '미검토'}
        </Badge>
      </div>
      {exercise.status === 'suspended' && (
        <Banner
          status='note'
          icon='info'
          layout='inline'
          title='안내'>
          검토 중으로 새 풀이가 중단된 문제입니다. 과거 제출 기록은 유지됩니다.
        </Banner>
      )}
      {exercise.needsReview && (
        <Banner
          status='note'
          icon='info'
          layout='inline'
          title='안내'>
          근거가 변경되어 확인이 필요한 문제입니다. 새 풀이는 검토 후 진행하고,
          기존 답안과 당시 원문은 아래 기록에서 확인하세요.
        </Banner>
      )}
      {exercise.state.excluded && (
        <Banner
          status='note'
          icon='info'
          layout='inline'
          title='안내'>
          내 복습에서 제외한 문제입니다. 다시 포함할 때 기존 답안과 이력은
          유지됩니다.
        </Banner>
      )}
      <Heading
        level={3}
        id={`exercise-${exercise.id}-question`}
        className={styles.question}>
        {exercise.payload.question}
      </Heading>
      <form
        onSubmit={(event) => void submit(event)}
        className={styles.form}>
        {exercise.payload.type === 'choice' ? (
          <RadioList
            label='알맞은 답을 선택하세요'
            htmlName={'exercise-' + exercise.id}
            value={answer}
            isDisabled={disabled}
            onChange={change}>
            {exercise.payload.choices.map((choice, index) => (
              <RadioListItem
                key={index}
                value={choice}
                label={`${String.fromCharCode(65 + index)}. ${choice}`}
              />
            ))}
          </RadioList>
        ) : (
          <TextArea
            label={contentLabel(
              <>
                {exercise.payload.type === 'free_response'
                  ? '원문을 적용해 내 생각을 적어 보세요'
                  : '답안'}
              </>
            )}
            value={answer}
            disabled={disabled}
            maxLength={5000}
            onChange={(event) => change(event.target.value)}
            required
          />
        )}
        <Text
          as='p'
          display='block'
          color='secondary'
          className={styles.meta}
          role='status'>
          {saveStatus}
        </Text>
        <div className={styles.row}>
          <Button
            loading={busy}
            disabled={disabled || !answer.trim()}>
            {exercise.payload.type === 'free_response'
              ? '제출하고 AI 피드백 받기'
              : '제출하고 채점하기'}
          </Button>
          <Button
            type='button'
            variant='secondary'
            disabled={disabled}
            onClick={() => void hintOrReveal('hint')}>
            힌트
          </Button>
          <Button
            type='button'
            variant='ghost'
            disabled={disabled}
            onClick={() => void hintOrReveal('reveal')}>
            정답 보기
          </Button>
        </div>
      </form>
      {hint && (
        <Banner
          status='note'
          icon='lightbulb'
          layout='inline'
          title='힌트'>
          {hint}
        </Banner>
      )}
      {revealed && (
        <div className={styles.revealed}>
          <Heading
            level={4}
            className={styles.revealedTitle}>
            정답 열람 · 도움 사용으로 기록됩니다
          </Heading>
          <Text
            as='p'
            display='block'
            className={styles.prose}>
            {revealed.answer}
          </Text>
          <Text
            as='p'
            display='block'
            className={styles.prose}>
            {revealed.explanation}
          </Text>
        </div>
      )}
      {result && (
        <div
          role='status'
          className={styles.result}
          data-tone={
            result.correct === true
              ? 'correct'
              : result.correct === false
                ? 'wrong'
                : 'feedback'
          }>
          <Badge
            className={styles.resultBadge}
            tone={
              result.correct === true
                ? 'success'
                : result.correct === false
                  ? 'warning'
                  : 'review'
            }>
            {result.correct === true && (
              <Icon
                name='check'
                size={14}
              />
            )}
            {result.correct === null
              ? '자유답변 AI 피드백 · 정오 판정과 별도'
              : result.correct
                ? '정답'
                : '다시 확인해 보세요'}
          </Badge>
          <Text
            as='p'
            display='block'
            className={styles.prose}>
            <strong>제출 답안</strong> {result.answer}
          </Text>
          <Text
            as='p'
            display='block'
            className={styles.prose}>
            <strong>
              {result.correct === null ? '참고 답안' : '기준 정답'}
            </strong>{' '}
            {result.expectedAnswer}
          </Text>
          <Text
            as='p'
            display='block'
            className={styles.prose}>
            {result.explanation}
          </Text>
          {result.feedback && (
            <Text
              as='p'
              display='block'
              className={styles.prose}>
              {result.feedback}
            </Text>
          )}
          <Text
            as='p'
            display='block'
            className={styles.resultMeta}>
            {result.hintUsed ? '힌트 사용' : '힌트 사용 안 함'} ·{' '}
            {result.revealed ? '정답 열람 후 제출' : '정답 열람 전 제출'} · 문제
            v{result.version}
          </Text>
          <Button
            type='button'
            size='small'
            variant='secondary'
            className={styles.retry}
            onClick={() => {
              setResult(null);
              setRevealed(null);
              setHint('');
              change('');
            }}>
            저장된 문제 다시 풀기
          </Button>
        </div>
      )}
      {exercise.payload.practiceStyle === 'flex' &&
        exercise.payload.skill === 'listening' &&
        exercise.source.kind === 'video' &&
        exercise.source.youtubeId && (
          <iframe
            className={styles.audio}
            src={`https://www.youtube.com/embed/${encodeURIComponent(exercise.source.youtubeId)}?start=${Math.floor(exercise.source.start ?? 0)}&end=${Math.ceil(exercise.source.end ?? 0)}`}
            title='FLEX형 듣기 연습의 실제 원문 영상'
            allow='encrypted-media; picture-in-picture'
            allowFullScreen
          />
        )}
      <div className={styles.source}>
        <Text
          as='p'
          display='block'
          color='secondary'
          className={styles.caption}>
          출제에 사용한 원문 · {sourceLabel(exercise.source)}
        </Text>
        {exercise.payload.practiceStyle === 'flex' &&
        exercise.payload.skill === 'listening' &&
        !result &&
        !revealed ? (
          <Banner
            status='note'
            icon='info'
            layout='inline'
            title='안내'>
            먼저 원문 음성을 듣고 답해 보세요. 제출하거나 정답을 확인한 뒤 출제
            근거 문장을 보여 줍니다.
          </Banner>
        ) : (
          <Blockquote>“{exercise.payload.sourceQuote}”</Blockquote>
        )}
        <Link
          className={styles.sourceLink}
          href={materialPaths.source(exercise.source)}>
          원문과 설명으로 돌아가기 ↗
        </Link>
      </div>
      <div className={styles.tools}>
        <Button
          type='button'
          size='small'
          variant='ghost'
          disabled={busy}
          startIcon='flag'
          onClick={() => setReport(true)}>
          이 문제 오류 신고
        </Button>
        <Button
          type='button'
          size='small'
          variant='ghost'
          disabled={busy}
          startIcon={exercise.state.excluded ? 'eye' : 'eye-off'}
          onClick={() => void exclude()}>
          {exercise.state.excluded ? '내 복습에 다시 포함' : '내 복습에서 제외'}
        </Button>
      </div>
      {error && (
        <Banner
          status='error'
          title='확인이 필요해요'
          role='alert'>
          {error}
        </Banner>
      )}
      <div className={styles.attempts}>
        <ExerciseAttempts
          id={exercise.id}
          reload={reload}
        />
      </div>
      {report && (
        <QuestionComposer
          source={exercise.source}
          language={exercise.source.language}
          report
          attachment={{ artifactId: exercise.id, version: exercise.version }}
          attachmentText={exercise.payload.question}
          onClose={() => setReport(false)}
        />
      )}
    </Card>
  );
}
