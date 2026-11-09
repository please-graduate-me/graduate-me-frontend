'use client';
import { useAnswerViewport } from './useAnswerViewport';
import { Button } from '@/components/ui/primitives/Button';
import { Panel } from '@/components/ui/layouts/Panel';
import * as styles from './Study.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type {
  Lesson,
  SegmentState,
  ActionResult,
} from '@/domains/videos/model/contracts';
import { applyDemoLearningAction } from '@/domains/videos/lib/demoLesson';
import { applyLearningAction } from '@/domains/videos/api/videos';
import { learningConfig, answerLimits } from '@/domains/videos/config/catalog';
import { videoPaths } from '@/domains/videos/config/paths';
import { useRouter } from 'next/navigation';
import { type Grade, type Mode } from '@/domains/videos/model/contracts';
import { isTextInput } from '@/lib/dom/isTextInput';
import type { LearningAction } from '@/domains/videos/model/contracts';
import { useYouTubePlayer } from './useYouTubePlayer';
import { LearningModeSwitch } from '@/domains/videos/ui/LearningModeSwitch';
import { SegmentSelect } from './SegmentSelect';
import { VideoInfo } from './VideoInfo';
import { PlaybackStatus } from './PlaybackStatus';
import { LearningOptions } from './LearningOptions';
import { useLearningSettings } from './useLearningSettings';
import { Icon } from '@/components/ui/primitives/Icon';
import { IconButton } from '@/components/ui/primitives/IconButton';
import { Badge } from '@/components/ui/primitives/Badge';
import { Select } from '@/components/ui/primitives/Select';
import { TextArea } from '@/components/ui/primitives/TextArea';
import { VideoScript } from './VideoScript';

/** 저장과 제출 및 구절 이동의 순서를 한 화면에서 조율한다. */
export function Study({
  initial,
  demo = false,
}: {
  initial: Lesson;
  demo?: boolean;
}) {
  const router = useRouter();
  const { video, segments } = initial;

  const {
    settings,
    saving: savingSettings,
    error: settingsError,
    change: changeSettings,
  } = useLearningSettings(initial.settings, !demo);

  const [scriptView, setScriptView] = useState(false);
  const [answerFocused, setAnswerFocused] = useState(false);
  const answerForm = useAnswerViewport(answerFocused);
  const [index, setIndex] = useState(initial.progress.currentIndex);
  const [mode, setMode] = useState<Mode>(initial.progress.mode);
  const [states, setStates] = useState(initial.states);

  const [difficultSegmentIds, setDifficultSegmentIds] = useState(
    initial.difficultSegmentIds
  );

  const [feedback, setFeedback] = useState<Grade | null>(null);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [error, setError] = useState('');

  const [saveStatus, setSaveStatus] = useState(
    demo ? '체험 중에만 유지됨' : '저장됨'
  );

  const unsaved = useRef<LearningAction | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const input = useRef<HTMLTextAreaElement>(null);
  const blanksContainer = useRef<HTMLDivElement>(null);
  const segment = segments[index];
  const complete = !segment;

  const {
    mount,
    ready: playerReady,
    playing,
    buffering,
    waiting,
    actualRate,
    error: playerError,
    blocked,
    replay,
    rewind,
    toggle,
    pause,
    resetPlayback,
    prepareNext,
  } = useYouTubePlayer(video.youtubeId, segment, settings);

  const state = states.find(
    (item) => item.segmentId === segment?.id && item.mode === mode
  );

  const draft =
    mode === 'full'
      ? typeof state?.draft === 'string'
        ? state.draft
        : ''
      : (segment?.blanks.map((_, position) =>
          Array.isArray(state?.draft) ? (state.draft[position] ?? '') : ''
        ) ?? []);

  const enqueue = useCallback(
    (body: LearningAction): Promise<ActionResult> => {
      // 저장 실패 후에도 재시도 요청을 큐에 넣을 수 있어야 한다.
      const task = queue.current
        .catch(() => undefined)
        .then(() =>
          demo
            ? applyDemoLearningAction(initial, body)
            : applyLearningAction(video.id, body)
        );

      queue.current = task;

      return task;
    },
    [video.id, demo, initial]
  );

  const flushDraft = useCallback(async () => {
    clearTimeout(timer.current);
    const body = unsaved.current;

    if (!body) {
      await queue.current.catch(() => undefined);

      return;
    }

    try {
      await enqueue(body);

      // 응답을 기다리는 동안 입력한 새 답안을 저장 완료로 지우지 않는다.
      if (unsaved.current === body) {
        unsaved.current = null;
        setSaveStatus(demo ? '체험 중에만 유지됨' : '저장됨');
      }
    } catch (error) {
      setSaveStatus('저장 실패');
      throw error;
    }
  }, [enqueue, demo]);

  useEffect(() => {
    function beforeUnload(event: BeforeUnloadEvent) {
      if (unsaved.current || busyRef.current) {
        event.preventDefault();
        event.returnValue = '';
      }
    }

    function followLink(event: MouseEvent) {
      const link =
        event.target instanceof Element ? event.target.closest('a') : null;

      if (
        !link ||
        event.ctrlKey ||
        event.metaKey ||
        link.target === '_blank' ||
        (!unsaved.current && !busyRef.current)
      )
        return;
      event.preventDefault();
      event.stopPropagation();
      if (busyRef.current) return;

      void flushDraft()
        .then(() => {
          router.push(link.href);
        })
        .catch((error) => setError(error.message));
    }

    window.addEventListener('beforeunload', beforeUnload);
    document.addEventListener('click', followLink, true);

    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      document.removeEventListener('click', followLink, true);
      clearTimeout(timer.current);
    };
  }, [flushDraft, router]);

  function updateState(
    patch: Partial<SegmentState>,
    segmentId = segment.id,
    selectedMode = mode
  ) {
    setStates((previous) => {
      const existing = previous.find(
        (item) => item.segmentId === segmentId && item.mode === selectedMode
      );

      const next: SegmentState = {
        segmentId,
        mode: selectedMode,
        draft: selectedMode === 'full' ? '' : [],
        status: 'pending',
        revealed: false,
        ...existing,
        ...patch,
      };

      return [
        ...previous.filter(
          (item) =>
            !(item.segmentId === segmentId && item.mode === selectedMode)
        ),
        next,
      ];
    });
  }

  function changeDraft(answer: string | string[]) {
    updateState({ draft: answer });
    setFeedback(null);
    setSaveStatus(demo ? '체험 중에만 유지됨' : '저장 중…');
    unsaved.current = { action: 'draft', segmentId: segment.id, mode, answer };
    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      void flushDraft().catch((error) => setError(error.message));
    }, learningConfig.draftDelay);
  }

  async function perform(operation: () => Promise<void>) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError('');

    try {
      // 구절 이동과 제출이 마지막 입력의 저장보다 앞서지 않게 한다.
      await flushDraft();
      await operation();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  async function navigate(next: number, nextMode = mode) {
    await perform(async () => {
      await enqueue({ action: 'navigate', index: next, mode: nextMode });
      pause();
      setIndex(next);
      setMode(nextMode);
      setFeedback(null);
      setScriptView(false);
    });
  }

  async function reset() {
    if (busyRef.current) return;
    pause();
    if (
      !window.confirm(
        '이 영상의 두 학습 모드에 저장된 답안, 제출 기록, 정답 보기, 건너뛰기, 안 들리는 구절 표시와 진도를 모두 삭제할까요? 되돌릴 수 없으며 첫 구절부터 다시 시작합니다.'
      )
    )
      return;

    await perform(async () => {
      // 대기 중인 저장을 끝낸 뒤 초기화해야 이전 답안이 다시 저장되지 않는다.
      await enqueue({ action: 'reset' });
      resetPlayback(segments[0]?.start ?? 0);
      setStates([]);
      setDifficultSegmentIds([]);
      setIndex(0);
      setMode('blank');
      setFeedback(null);
      setSaveStatus(demo ? '체험 중에만 유지됨' : '저장됨');
    });
  }

  async function submit() {
    if (!segment) return;

    await perform(async () => {
      const result = await enqueue({
        action: 'submit',
        segmentId: segment.id,
        mode,
        answer: draft,
        requestId: crypto.randomUUID(),
      });

      setFeedback(result.grade!);

      if (result.grade?.correct) {
        updateState({ status: 'correct' });
        prepareNext();
        setIndex(result.nextIndex!);
      }
    });
  }

  async function toggleDifficulty() {
    if (!segment) return;
    const marked = !difficultSegmentIds.includes(segment.id);

    await perform(async () => {
      await enqueue({ action: 'difficulty', segmentId: segment.id, marked });

      setDifficultSegmentIds((ids) =>
        marked ? [...ids, segment.id] : ids.filter((id) => id !== segment.id)
      );
    });
  }

  async function skip() {
    await perform(async () => {
      const result = await enqueue({
        action: 'skip',
        segmentId: segment.id,
        mode,
      });

      updateState({
        status: state?.status === 'correct' ? 'correct' : 'skipped',
      });

      pause();
      setIndex(result.nextIndex!);
      setFeedback(null);
    });
  }

  async function reveal() {
    await perform(async () => {
      await enqueue({ action: 'reveal', segmentId: segment.id, mode });
      updateState({ revealed: true });
    });
  }

  useEffect(() => {
    // 모바일은 사용자가 입력을 선택하기 전 키보드와 영상 접힘을 유발하지 않는다.
    if (!busy && segment && window.matchMedia('(min-width: 901px)').matches) {
      if (mode === 'full' && input.current) {
        input.current.focus();

        input.current.setSelectionRange(
          input.current.value.length,
          input.current.value.length
        );
      } else blanksContainer.current?.querySelector('input')?.focus();
    }
  }, [index, mode, busy, segment]);

  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if (event.isComposing || !segment || busyRef.current) return;
      const target = event.target;

      const answerFocused =
        target instanceof HTMLElement &&
        Boolean(target.closest('[data-answer]'));

      if (event.ctrlKey && event.key.toLowerCase() === 'r' && answerFocused) {
        event.preventDefault();
        replay();
      } else if (event.shiftKey && event.key === 'ArrowLeft') {
        event.preventDefault();
        rewind();
      } else if (
        event.code === 'Space' &&
        !isTextInput(target) &&
        !(target instanceof HTMLElement && target.closest('button, a, summary'))
      ) {
        event.preventDefault();
        toggle();
      }
    }

    window.addEventListener('keydown', keydown);

    return () => window.removeEventListener('keydown', keydown);
  }, [segment, replay, rewind, toggle]);

  const correct = states.filter(
    (item) => item.mode === mode && item.status === 'correct'
  ).length;

  const skipped = states.filter(
    (item) => item.mode === mode && item.status === 'skipped'
  ).length;

  const revealed = states.filter(
    (item) => item.mode === mode && item.revealed
  ).length;

  return (
    <div className={styles.study}>
      <header className={styles.header}>
        <Link
          href={videoPaths.library}
          className={styles.backLink}
          aria-label='내 학습으로 돌아가기'>
          <Icon name='arrow-left' />
        </Link>
        <div className={styles.headerTitle}>
          <h1>{video.title}</h1>
          <p>영상 학습 · {segments.length}개 구절</p>
        </div>
        <Badge tone='brand'>
          <Icon
            name='headphones'
            size={16}
          />{' '}
          {correct} / {segments.length} 구절 완료
        </Badge>
        <Link
          href={videoPaths.library}
          className={styles.exitLink}>
          학습 종료
        </Link>
      </header>
      {demo && (
        <p className={styles.notice}>
          체험 모드 · 답안과 진도는 페이지를 떠나면 사라집니다.
        </p>
      )}
      {error && (
        <div
          className={styles.error}
          role='alert'>
          {error}
          {saveStatus === '저장 실패' && (
            <Button
              variant='secondary'
              onClick={() => void perform(async () => {})}>
              저장 다시 시도
            </Button>
          )}
        </div>
      )}
      <div className={styles.studyGrid}>
        <main className={styles.main}>
          {!complete && (
            <>
              <section
                className={styles.playerPanel}
                aria-label='영상 플레이어'>
                <div
                  id='lesson-video-player'
                  className={styles.videoFrame}
                  ref={mount}
                />
                {playerError && (
                  <p
                    role='alert'
                    className={styles.error}>
                    {playerError}
                  </p>
                )}
                {blocked && (
                  <p className={styles.notice}>
                    재생 버튼을 눌러 구절을 들어 주세요.
                  </p>
                )}
                <div className={styles.playbackToolbar}>
                  <IconButton
                    label={playing || waiting ? '일시정지' : '재생'}
                    name={playing || waiting ? 'pause' : 'play'}
                    onClick={toggle}
                    disabled={!playerReady}
                  />
                  <IconButton
                    label='현재 구절 다시 듣기'
                    name='rotate-ccw'
                    onClick={replay}
                    disabled={!playerReady}
                  />
                  <span className={styles.time}>
                    {segment.start.toFixed(0)}초 /{' '}
                    {video.duration?.toFixed(0) ?? '알 수 없음'}초
                  </span>
                  <progress
                    className={styles.progress}
                    max={segments.length}
                    value={index + 1}
                    aria-label='전체 구절 중 현재 위치'
                  />
                  <Icon
                    name='volume-2'
                    size={18}
                  />
                  <Select
                    aria-label='재생 속도'
                    value={settings.playbackRate}
                    disabled={savingSettings}
                    onChange={(event) =>
                      void changeSettings({
                        ...settings,
                        playbackRate: Number(
                          event.target.value
                        ) as typeof settings.playbackRate,
                      })
                    }>
                    {([0.5, 0.75, 1, 1.25, 1.5] as const).map((rate) => (
                      <option
                        key={rate}
                        value={rate}>
                        {rate}배
                      </option>
                    ))}
                  </Select>
                  <label className={styles.repeatControl}>
                    <input
                      type='checkbox'
                      checked={settings.autoReplay}
                      disabled={savingSettings}
                      onChange={(event) =>
                        void changeSettings({
                          ...settings,
                          autoReplay: event.target.checked,
                        })
                      }
                    />
                    자동 반복
                  </label>
                </div>
              </section>
              <section
                className={styles.answerPanel}
                aria-label='받아쓰기'>
                <div className={styles.answerHeading}>
                  <Badge tone='brand'>
                    <Icon
                      name='headphones'
                      size={16}
                    />{' '}
                    구절 {String(index + 1).padStart(2, '0')}
                  </Badge>
                  <span className={styles.small}>
                    {segment.start.toFixed(0)}초 ~ {segment.end.toFixed(0)}초
                  </span>
                  <Button
                    variant='ghost'
                    size='small'
                    onClick={replay}
                    disabled={!playerReady}>
                    <Icon
                      name='repeat-2'
                      size={16}
                    />
                    구절 반복
                  </Button>
                  <span
                    className={styles.saveStatus}
                    role='status'>
                    {saveStatus}
                  </span>
                </div>
                <div className={styles.modeRow}>
                  <LearningModeSwitch
                    mode={mode}
                    disabled={busy}
                    onChange={(next) => {
                      setScriptView(false);
                      void navigate(index, next);
                    }}
                  />
                  <button
                    type='button'
                    className={styles.scriptTab}
                    aria-pressed={scriptView}
                    disabled={busy}
                    onClick={() => {
                      setScriptView(true);
                      if (!state?.revealed) void reveal();
                    }}>
                    스크립트
                  </button>
                </div>
                {scriptView ? (
                  <div className={styles.scriptReading}>
                    <p className={styles.muted}>
                      정답을 확인한 구절은 학습 기록에 표시됩니다.
                    </p>
                    <p lang='en'>
                      {state?.revealed
                        ? segment.text
                        : '스크립트를 불러오고 있습니다.'}
                    </p>
                  </div>
                ) : (
                  <form
                    ref={answerForm}
                    onFocusCapture={() => setAnswerFocused(true)}
                    onSubmit={(event) => {
                      event.preventDefault();
                      void submit();
                    }}>
                    {mode === 'full' ? (
                      <TextArea
                        className={styles.answerInput}
                        aria-label='들리는 문장'
                        ref={input}
                        data-answer
                        value={typeof draft === 'string' ? draft : ''}
                        maxLength={answerLimits.full}
                        disabled={busy}
                        autoComplete='off'
                        autoCorrect='off'
                        autoCapitalize='off'
                        spellCheck={false}
                        placeholder='들은 내용을 영어로 적어 주세요.'
                        onChange={(event) => changeDraft(event.target.value)}
                        onKeyDown={(event) => {
                          if (
                            event.key === 'Enter' &&
                            !event.nativeEvent.isComposing
                          ) {
                            event.preventDefault();
                            void submit();
                          }
                        }}
                      />
                    ) : (
                      <div
                        className={styles.blankSentence}
                        ref={blanksContainer}
                        data-answer>
                        {segment.text.split(/\s+/).map((word, wordIndex) => {
                          const position = segment.blanks.indexOf(wordIndex);

                          return position < 0 ? (
                            <span key={wordIndex}>{word} </span>
                          ) : (
                            <input
                              key={wordIndex}
                              aria-label={`빈칸 ${position + 1}`}
                              maxLength={answerLimits.blank}
                              disabled={busy}
                              autoComplete='off'
                              autoCorrect='off'
                              autoCapitalize='off'
                              spellCheck={false}
                              value={
                                Array.isArray(draft)
                                  ? (draft[position] ?? '')
                                  : ''
                              }
                              onChange={(event) => {
                                const next = Array.isArray(draft)
                                  ? [...draft]
                                  : segment.blanks.map(() => '');

                                next[position] = event.target.value;
                                changeDraft(next);
                              }}
                            />
                          );
                        })}
                      </div>
                    )}
                    <div className={styles.answerActions}>
                      <Button disabled={busy}>
                        {busy ? '저장 중…' : '제출하기'}
                      </Button>
                      <Button
                        type='button'
                        variant='secondary'
                        disabled={busy}
                        onClick={replay}>
                        다시 듣기
                      </Button>
                      <span className={styles.small}>Enter 제출</span>
                      <Button
                        type='button'
                        variant='ghost'
                        size='small'
                        disabled={busy}
                        onClick={() => void reveal()}>
                        정답 보기
                      </Button>
                    </div>
                  </form>
                )}
                {feedback && (
                  <div
                    className={[
                      styles.notice,
                      feedback.correct ? styles.success : '',
                    ].join(' ')}
                    role='status'>
                    {feedback.correct ? (
                      '정답이에요. 다음 구절로 이동했어요.'
                    ) : (
                      <>
                        <p>다른 부분을 확인하고 다시 들어보세요.</p>
                        <div className={styles.differences}>
                          {feedback.differences.map((diff, i) => (
                            <span
                              key={i}
                              className={[styles.diff, styles[diff.kind]].join(
                                ' '
                              )}>
                              {diff.kind === 'match'
                                ? diff.expected
                                : diff.kind === 'missing'
                                  ? `누락: ${diff.expected}`
                                  : diff.kind === 'extra'
                                    ? `추가: ${diff.actual}`
                                    : `${diff.actual} → ${diff.expected}`}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
                {!scriptView && state?.revealed && (
                  <div className={styles.notice}>
                    <strong>정답</strong>
                    <p lang='en'>{segment.text}</p>
                    <p className={styles.small}>
                      음성 인식 결과에 오류가 있으면 이 구절을 건너뛰거나
                      도우미에게 질문할 수 있어요.
                    </p>
                  </div>
                )}
                <div className={styles.secondaryActions}>
                  <Button
                    variant='ghost'
                    size='small'
                    disabled={busy}
                    onClick={() => void skip()}>
                    건너뛰기
                  </Button>
                  <Button
                    variant='ghost'
                    size='small'
                    disabled={busy}
                    aria-pressed={difficultSegmentIds.includes(segment.id)}
                    onClick={() => void toggleDifficulty()}>
                    <Icon
                      name='flag'
                      size={16}
                    />
                    {difficultSegmentIds.includes(segment.id)
                      ? '안 들리는 구절 표시 해제'
                      : '안 들리는 구절 표시'}
                  </Button>
                  <div className={styles.navigation}>
                    <IconButton
                      label='이전 구절'
                      name='chevron-left'
                      disabled={busy || index === 0}
                      onClick={() => void navigate(index - 1)}
                    />
                    <IconButton
                      label='다음 구절'
                      name='chevron-right'
                      disabled={busy}
                      onClick={() => void navigate(index + 1)}
                    />
                  </div>
                </div>
              </section>
            </>
          )}
          {complete && (
            <Panel className={styles.completion}>
              <Badge tone='success'>
                <Icon
                  name='check-check'
                  size={16}
                />
                학습 완료
              </Badge>
              <h2>마지막 구절까지 도착했어요.</h2>
              <p>
                {mode === 'full' ? '문장 전체' : '빈칸 채우기'} · 전체{' '}
                {segments.length}구절
              </p>
              <div className={styles.stats}>
                <span>
                  정답 <strong>{correct}</strong>
                </span>
                <span>
                  건너뛰기 <strong>{skipped}</strong>
                </span>
                <span>
                  미완료 <strong>{segments.length - correct - skipped}</strong>
                </span>
              </div>
              <p className={styles.muted}>정답을 확인한 구절: {revealed}개</p>
              <Button
                disabled={busy}
                onClick={() => void navigate(0)}>
                처음부터 복습
              </Button>
              <Button
                variant='secondary'
                disabled={busy}
                onClick={() =>
                  void navigate(0, mode === 'full' ? 'blank' : 'full')
                }>
                다른 모드로 학습
              </Button>
            </Panel>
          )}
          <details className={styles.learningDetails}>
            <summary>학습 설정과 단축키</summary>
            <PlaybackStatus
              playing={playing}
              waiting={waiting}
              ready={playerReady}
              buffering={buffering}
              blocked={blocked}
              error={playerError}
            />
            <LearningOptions
              settings={settings}
              temporary={demo}
              saving={savingSettings}
              error={settingsError}
              actualRate={actualRate}
              ready={playerReady}
              onChange={(next) => void changeSettings(next)}
            />
            <p className={styles.small}>
              Ctrl+R: 다시 듣기 · 입력창 밖 Space: 재생 / 일시정지 · Shift+←:
              2초 전 · Enter: 제출
            </p>
            <SegmentSelect
              segments={segments}
              states={states}
              difficultSegmentIds={difficultSegmentIds}
              mode={mode}
              index={index}
              disabled={busy}
              onNavigate={(next) => void navigate(next)}
            />
          </details>
          <details className={styles.learningDetails}>
            <summary>영상 정보와 학습 기록 관리</summary>
            {!demo && (
              <VideoInfo
                video={video}
                initialFavorite={initial.progress.favorite}
              />
            )}
            <p className={styles.muted}>
              이 영상의 두 모드 답안과 구절 표시 및 진도를 삭제하고 처음부터
              시작합니다.
            </p>
            <Button
              variant='danger'
              disabled={busy}
              onClick={() => void reset()}>
              이 영상 기록 초기화
            </Button>
          </details>
        </main>
        <VideoScript
          segments={segments}
          states={states}
          index={index}
          mode={mode}
          busy={busy}
          videoId={video.id}
          demo={demo}
          onNavigate={(next) => void navigate(next)}
        />
      </div>
    </div>
  );
}
