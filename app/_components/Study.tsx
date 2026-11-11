'use client';
import { ApiError } from '@/lib/api/request';
import { SessionRecovery } from './SessionRecovery';
import { useWatchPosition } from './useWatchPosition';
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
import { applyLearningAction, getLesson } from '@/domains/videos/api/videos';
import { learningConfig, answerLimits } from '@/domains/videos/config/catalog';
import { videoPaths } from '@/domains/videos/config/paths';
import { useRouter } from 'next/navigation';
import { type Grade, type Mode } from '@/domains/videos/model/contracts';
import { playbackPosition } from '@/domains/videos/lib/playback';
import { Switch } from '@/components/ui/primitives/Switch';
import { Slider } from '@/components/ui/primitives/Slider';
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
import type { SourceInput } from '@/domains/materials/model/source';
import { VideoScript } from './VideoScript';

/** 저장과 제출 및 구절 이동의 순서를 한 화면에서 조율한다. */
export function Study({
  initial,
  demo = false,
  selection,
}: {
  initial: Lesson;
  demo?: boolean;
  selection?: SourceInput;
}) {
  const router = useRouter();
  const { video } = initial;
  const [segments, setSegments] = useState(initial.segments);
  const [preparation, setPreparation] = useState(initial.preparation);

  const [blankRatio, setBlankRatio] = useState<20 | 40 | 60>(
    initial.progress.blankRatio ?? 20
  );

  const [scriptViewed, setScriptViewed] = useState(
    initial.progress.scriptViewed ?? false
  );

  const loadedVersions = useRef(
    JSON.stringify(initial.segments.map((item) => [item.id, item.version ?? 1]))
  );

  const [hint, setHint] = useState('');
  const blankAvailable = preparation?.blanks === 'ready' || !preparation;

  const {
    settings,
    saving: savingSettings,
    error: settingsError,
    change: changeSettings,
  } = useLearningSettings(initial.settings, !demo);

  const [scriptView, setScriptView] = useState(
    initial.progress.watchMode === 'script'
  );

  const [answerFocused, setAnswerFocused] = useState(false);
  const answerForm = useAnswerViewport(answerFocused);

  const [index, setIndex] = useState(
    initial.progress.currentIndex < initial.segments.length &&
      initial.progress.playbackPosition
      ? (playbackPosition(initial.progress.playbackPosition, initial.segments)
          ?.index ?? initial.progress.currentIndex)
      : initial.progress.currentIndex
  );

  const [mode, setMode] = useState<Mode>(
    initial.progress.mode === 'blank' && !blankAvailable
      ? 'full'
      : initial.progress.mode
  );

  const [states, setStates] = useState(initial.states);

  const [difficultSegmentIds, setDifficultSegmentIds] = useState(
    initial.difficultSegmentIds
  );

  const [feedback, setFeedback] = useState<Grade | null>(null);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);

  const [saveStatus, setSaveStatus] = useState(
    demo ? '체험 중에만 유지됨' : '저장됨'
  );

  const unsaved = useRef<LearningAction | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const submission = useRef<{ key: string; requestId: string } | null>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const blanksContainer = useRef<HTMLDivElement>(null);
  const segment = segments[index];
  const complete = !segment;

  const currentStates = states.filter((item) =>
    segments.some(
      (value) =>
        value.id === item.segmentId &&
        (value.version ?? 1) === (item.sourceVersion ?? 1)
    )
  );

  useEffect(() => {
    let active = true;

    const nextVersions = JSON.stringify(
      initial.segments.map((item) => [item.id, item.version ?? 1])
    );

    const changed = loadedVersions.current !== nextVersions;

    // 상태 조회의 후속 준비 결과만 반영해 작성 중인 답안과 모드를 유지한다.
    queueMicrotask(() => {
      if (!active) return;
      loadedVersions.current = nextVersions;
      setPreparation(initial.preparation);
      setSegments(initial.segments);

      if (changed) {
        setStates(initial.states);
        setScriptViewed(initial.progress.scriptViewed ?? false);
        setFeedback(null);
        setHint('');
        setSaveStatus('원문 버전이 변경되어 현재 버전의 상태를 불러왔습니다.');
      }
    });

    return () => {
      active = false;
    };
  }, [
    initial.preparation,
    initial.segments,
    initial.states,
    initial.progress.scriptViewed,
  ]);

  const {
    mount,
    ready: playerReady,
    playing,
    buffering,
    waiting,
    actualRate,
    currentTime,
    seekPlayback,
    error: playerError,
    blocked,
    replay,
    rewind,
    toggle,
    pause,
    resetPlayback,
    prepareNext,
  } = useYouTubePlayer(
    video.youtubeId,
    segment,
    settings,
    scriptView,
    initial.progress.watchMode === 'script'
      ? initial.progress.scriptPosition
      : initial.progress.playbackPosition
  );

  const watch = useWatchPosition(
    video.id,
    initial.progress,
    currentTime,
    scriptView,
    playerReady,
    playing,
    !demo
  );

  const state = currentStates.find(
    (item) =>
      item.segmentId === segment?.id &&
      item.mode === mode &&
      (mode !== 'blank' || (item.blankRatio ?? 20) === blankRatio)
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
      const action =
        'segmentId' in body && body.action !== 'difficulty'
          ? {
              ...body,
              sourceVersion:
                body.sourceVersion ??
                segments.find((item) => item.id === body.segmentId)?.version ??
                1,
            }
          : body;

      // 저장 실패 후에도 재시도 요청을 큐에 넣을 수 있어야 한다.
      const task = queue.current
        .catch(() => undefined)
        .then(() =>
          demo
            ? applyDemoLearningAction(initial, action)
            : applyLearningAction(video.id, action)
        );

      queue.current = task;

      return task;
    },
    [video.id, demo, initial, segments]
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
      if (error instanceof ApiError && error.status === 401)
        setSessionExpired(true);
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
        (item) =>
          item.segmentId === segmentId &&
          (item.sourceVersion ?? 1) ===
            (segments.find((value) => value.id === segmentId)?.version ?? 1) &&
          item.mode === selectedMode &&
          (selectedMode !== 'blank' || (item.blankRatio ?? 20) === blankRatio)
      );

      const next: SegmentState = {
        segmentId,
        mode: selectedMode,
        sourceVersion:
          segments.find((item) => item.id === segmentId)?.version ?? 1,
        draft: selectedMode === 'full' ? '' : [],
        status: 'pending',
        revealed: false,
        blankRatio: selectedMode === 'blank' ? blankRatio : 0,
        ...existing,
        ...patch,
      };

      return [
        ...previous.filter(
          (item) =>
            !(
              item.segmentId === segmentId &&
              item.mode === selectedMode &&
              (selectedMode !== 'blank' ||
                (item.blankRatio ?? 20) === blankRatio)
            )
        ),
        next,
      ];
    });
  }

  function changeDraft(answer: string | string[]) {
    updateState({ draft: answer });
    setFeedback(null);
    setSaveStatus(demo ? '체험 중에만 유지됨' : '저장 중…');

    unsaved.current = {
      action: 'draft',
      segmentId: segment.id,
      mode,
      answer,
      sourceVersion: segment.version ?? 1,
    };

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
      // 구절 이동과 제출이 답안·시청 위치 저장보다 앞서지 않게 한다.
      await flushDraft();
      await watch.save();
      await operation();
      setSessionExpired(false);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401)
        setSessionExpired(true);
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
      setHint('');
      setScriptView(false);
    });
  }

  async function seekTime(time: number) {
    const position = playbackPosition(time, segments);

    if (!position || busyRef.current) return;

    if (scriptView || position.index === index) {
      const target = scriptView ? time : position.time;

      seekPlayback(target);
      await watch.save(false, target, scriptView);

      return;
    }

    await perform(async () => {
      await enqueue({ action: 'navigate', index: position.index, mode });
      setIndex(position.index);
      setFeedback(null);
      setHint('');
      seekPlayback(position.time, true);
      await watch.save(false, position.time, false);
    });
  }

  async function reset() {
    if (busyRef.current) return;
    pause();
    if (
      !window.confirm(
        '이번 학습의 초안·정답 보기·현재 진도를 초기화하고 첫 구절부터 다시 시작할까요? 과거 제출 답안과 당시 근거 버전은 이력에 보존합니다.'
      )
    )
      return;

    await perform(async () => {
      // 대기 중인 저장을 끝낸 뒤 초기화해야 이전 답안이 다시 저장되지 않는다.
      await enqueue({ action: 'reset' });
      await watch.restart();
      resetPlayback(segments[0]?.start ?? 0);
      setStates([]);
      setDifficultSegmentIds([]);
      setIndex(0);
      setMode(blankAvailable ? 'blank' : 'full');
      setScriptViewed(false);
      setFeedback(null);
      setSaveStatus(demo ? '체험 중에만 유지됨' : '저장됨');
    });
  }

  async function submit() {
    if (!segment) return;

    await perform(async () => {
      const key = JSON.stringify([
        segment.id,
        segment.version,
        mode,
        blankRatio,
        draft,
      ]);

      if (submission.current?.key !== key)
        submission.current = { key, requestId: crypto.randomUUID() };

      const result = await enqueue({
        action: 'submit',
        segmentId: segment.id,
        mode,
        answer: draft,
        requestId: submission.current.requestId,
      });

      submission.current = null;
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

  async function openScript() {
    await perform(async () => {
      await enqueue({ action: 'viewScript' });
      setScriptViewed(true);
      setScriptView(true);
      const scriptTime = watch.positions.scriptPosition || currentTime;

      seekPlayback(scriptTime);
      await watch.save(false, scriptTime, true);
      setFeedback(null);
    });
  }

  async function showHint() {
    await perform(async () => {
      const value = await enqueue({
        action: 'hint',
        segmentId: segment.id,
        mode,
      });

      setHint(value.hint ?? '');
      updateState({ hintCount: value.hintCount ?? 1 });
    });
  }

  async function changeRatio(ratio: 20 | 40 | 60) {
    if (ratio === blankRatio || demo) return;

    await perform(async () => {
      await enqueue({ action: 'blankRatio', ratio });
      const lesson = await getLesson(video.id);

      setSegments(lesson.segments);
      setStates(lesson.states);
      setBlankRatio(ratio);
      setFeedback(null);
      setHint('');
      setSaveStatus('선택 비율의 저장된 답안 복원됨');
    });
  }

  async function refreshPreparation() {
    await perform(async () => {
      const lesson = await getLesson(video.id);

      setPreparation(lesson.preparation);
      setSegments(lesson.segments);
      setStates(lesson.states);
      setScriptViewed(lesson.progress.scriptViewed ?? false);
      setSaveStatus('자료 준비 상태 확인됨');
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

  const correct = new Set(
    currentStates
      .filter((item) => item.status === 'correct')
      .map((item) => item.segmentId)
  ).size;

  const skipped = currentStates.filter(
    (item) => item.mode === mode && item.status === 'skipped'
  ).length;

  const revealed = currentStates.filter(
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
      {(sessionExpired || watch.sessionExpired) && <SessionRecovery />}
      {watch.error && (
        <div
          className={styles.error}
          role='alert'>
          재생 위치 저장: {watch.error}
          <Button
            size='small'
            variant='secondary'
            onClick={() => void watch.resume()}>
            저장된 위치 확인 후 이 위치 저장
          </Button>
        </div>
      )}
      {demo && (
        <p className={styles.notice}>
          체험 모드 · 답안과 진도는 페이지를 떠나면 사라집니다.
        </p>
      )}
      {preparation && (
        <div className={styles.notice}>
          <strong>자료 준비 상태</strong>
          <p>
            원문 전사:{' '}
            {preparation.transcription === 'ready'
              ? '완료'
              : preparation.transcription === 'failed'
                ? '실패'
                : '준비 중'}{' '}
            · 저장 번역:{' '}
            {preparation.translation === 'ready'
              ? '완료'
              : preparation.translation === 'failed'
                ? '실패'
                : '준비 중'}{' '}
            · 빈칸 후보:{' '}
            {preparation.blanks === 'ready'
              ? '완료'
              : preparation.blanks === 'failed'
                ? '실패'
                : '준비 중'}
          </p>
          {preparation.error && <p>{preparation.error}</p>}
          {!blankAvailable && (
            <p>
              빈칸 후보가 준비되지 않아 전체 받아쓰기와 스크립트를 이용할 수
              있습니다. 단계 실패는 자동 재시도하지 않습니다.
            </p>
          )}
          <Button
            size='small'
            variant='ghost'
            disabled={busy}
            onClick={() => void refreshPreparation()}>
            저장된 준비 상태 조회
          </Button>
        </div>
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
                    {Math.floor(currentTime / 60)}:
                    {String(Math.floor(currentTime % 60)).padStart(2, '0')} /{' '}
                    {video.duration == null
                      ? '길이 미확인'
                      : `${Math.floor(video.duration / 60)}:${String(Math.floor(video.duration % 60)).padStart(2, '0')}`}
                  </span>
                  <Slider
                    className={styles.progress}
                    min={0}
                    max={video.duration ?? segments.at(-1)?.end ?? 0}
                    step={0.1}
                    value={currentTime}
                    disabled={!playerReady || busy}
                    aria-label='영상 재생 위치'
                    aria-valuetext={`${Math.floor(currentTime / 60)}분 ${Math.floor(currentTime % 60)}초`}
                    onChange={(event) =>
                      void seekTime(Number(event.target.value))
                    }
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
                    <Switch
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
                    blankAvailable={blankAvailable}
                    active={!scriptView}
                    onChange={(next) => {
                      void navigate(index, next);
                    }}
                  />
                  <button
                    type='button'
                    className={styles.scriptTab}
                    aria-pressed={scriptView}
                    disabled={busy}
                    onClick={() => void openScript()}>
                    스크립트
                  </button>
                </div>
                {scriptView ? (
                  <div className={styles.scriptReading}>
                    <p className={styles.muted}>
                      정답을 확인한 구절은 학습 기록에 표시됩니다.
                    </p>
                    {segments.map((item) => (
                      <div key={item.id}>
                        <p lang={video.language ?? 'en'}>{item.text}</p>
                        {item.translation && (
                          <p className={styles.muted}>{item.translation}</p>
                        )}
                      </div>
                    ))}
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
                        placeholder='들은 내용을 원문 언어로 적어 주세요.'
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
                        {(segment.units ?? segment.text.split(/\s+/)).map(
                          (word, wordIndex) => {
                            const position = segment.blanks.indexOf(wordIndex);

                            return position < 0 ? (
                              <span key={wordIndex}>
                                {word}
                                {video.language === 'th' ? '' : ' '}
                              </span>
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
                          }
                        )}
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
                        onClick={() => void showHint()}>
                        표현 힌트
                      </Button>
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
                {mode === 'blank' && !scriptView && (
                  <label className={styles.small}>
                    빈칸 비율 · 저장 후보 기준
                    <Select
                      value={blankRatio}
                      disabled={busy || demo}
                      onChange={(event) =>
                        void changeRatio(
                          Number(event.target.value) as 20 | 40 | 60
                        )
                      }>
                      <option value={20}>20% · 기본</option>
                      <option value={40}>40%</option>
                      <option value={60}>60%</option>
                    </Select>
                    실제 빈칸 {segment.blanks.length}개 ·{' '}
                    {Math.round(
                      segment.blankActualRatio ??
                        (100 * segment.blanks.length) /
                          Math.max(
                            1,
                            (segment.units ?? segment.text.split(/\s+/)).filter(
                              (unit) => /[\p{L}\p{N}]/u.test(unit)
                            ).length
                          )
                    )}
                    %
                    <br />
                    짧은 구절과 후보 수에 따라 실제 비율이 달라질 수 있습니다.
                    비율별 답안은 따로 보존하며 선택한 비율의 답안을 복원합니다.
                  </label>
                )}
                {hint && (
                  <p className={styles.notice}>
                    표현 힌트: {hint} · 도움 사용으로 기록됩니다.
                  </p>
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
                {!scriptView && (state?.revealed || scriptViewed) && (
                  <div className={styles.notice}>
                    <strong>정답</strong>
                    <p lang={video.language ?? 'en'}>{segment.text}</p>
                    {segment.translation && <p>{segment.translation}</p>}
                    <p className={styles.small}>
                      음성 인식 결과에 오류가 있으면 이 구절을 건너뛰거나
                      커뮤니티에 질문할 수 있어요.
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
              <Badge
                tone={
                  segments.length > 0 && correct === segments.length
                    ? 'success'
                    : 'warning'
                }>
                <Icon
                  name='check-check'
                  size={16}
                />
                {segments.length > 0 && correct === segments.length
                  ? '학습 완료'
                  : '끝 위치에 도착 · 미완료 구절 있음'}
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
                  미완료 <strong>{segments.length - correct}</strong>
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
                disabled={busy || (!blankAvailable && mode === 'full')}
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
              states={currentStates}
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
              현재 학습 상태와 진도를 초기화하고 새 회차를 시작합니다. 과거 제출
              당시의 답안과 근거 버전은 보존합니다.
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
          selection={selection}
          segments={segments}
          states={currentStates}
          index={
            scriptView
              ? (playbackPosition(currentTime, segments)?.index ?? index)
              : index
          }
          mode={mode}
          busy={busy}
          videoId={video.id}
          language={video.language ?? 'en'}
          scriptViewed={scriptViewed}
          demo={demo}
          onNavigate={(next) => void navigate(next)}
        />
      </div>
    </div>
  );
}
