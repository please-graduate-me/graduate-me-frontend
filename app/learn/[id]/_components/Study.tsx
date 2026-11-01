'use client';
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
import { applyLearningAction } from '@/domains/videos/api/videos';
import { learningConfig, answerLimits } from '@/domains/videos/config/catalog';
import { videoPaths } from '@/domains/videos/config/paths';
import { useRouter } from 'next/navigation';
import { type Grade, type Mode } from '@/domains/videos/model/contracts';
import { isTextInput } from '@/lib/dom/isTextInput';
import type { LearningAction } from '@/domains/videos/model/contracts';
import { useYouTubePlayer } from './useYouTubePlayer';
import { SegmentSelect } from './SegmentSelect';
import { VideoInfo } from './VideoInfo';
import { LearningOptions } from '../../../_components/LearningOptions';
import { useLearningSettings } from '../../../_components/useLearningSettings';

/** 저장과 제출 및 구절 이동의 순서를 한 화면에서 조율한다. */
export function Study({ initial }: { initial: Lesson }) {
  const router = useRouter();
  const { video, segments } = initial;
  const {
    settings,
    saving: savingSettings,
    error: settingsError,
    change: changeSettings,
  } = useLearningSettings(initial.settings);
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
  const [saveStatus, setSaveStatus] = useState('저장됨');
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
        .then(() => applyLearningAction(video.id, body));
      queue.current = task;
      return task;
    },
    [video.id]
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
        setSaveStatus('저장됨');
      }
    } catch (error) {
      setSaveStatus('저장 실패');
      throw error;
    }
  }, [enqueue]);
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
    setSaveStatus('저장 중…');
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
      setMode('full');
      setFeedback(null);
      setSaveStatus('저장됨');
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
    if (!busy && segment) {
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
    <>
      <Link
        href={videoPaths.home}
        onClick={(event) => {
          if (unsaved.current || busyRef.current) {
            event.preventDefault();
            void perform(async () => {
              router.push(videoPaths.home);
            });
          }
        }}>
        ← 영상 목록
      </Link>
      <div className={styles.sectionHeading}>
        <h1 className={styles.lessonTitle}>{video.title}</h1>
        <span
          className={[styles.muted, styles.small].join(' ')}
          role='status'>
          {saveStatus}
        </span>
      </div>
      {error && (
        <p
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
        </p>
      )}
      <VideoInfo
        video={video}
        initialFavorite={initial.progress.favorite}
      />
      <SegmentSelect
        segments={segments}
        states={states}
        difficultSegmentIds={difficultSegmentIds}
        mode={mode}
        index={index}
        disabled={busy}
        onNavigate={(next) => void navigate(next)}
      />
      <div className={styles.studyGrid}>
        <Panel
          hidden={complete}
          aria-label='영상 플레이어'>
          <div
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
          <div className={[styles.row, styles.controls].join(' ')}>
            <Button
              onClick={toggle}
              disabled={!playerReady || complete}>
              {playing || waiting ? '일시정지' : '재생'}
            </Button>
            <Button
              variant='secondary'
              onClick={replay}
              disabled={!playerReady || complete}>
              다시 듣기
            </Button>
            <Button
              variant='secondary'
              onClick={rewind}
              disabled={!playerReady || complete}>
              2초 뒤로
            </Button>
          </div>
          <p className={[styles.muted, styles.small].join(' ')}>
            구절 끝에서 자동으로 멈춰요. 영상 안의 자막은 플레이어에서 끌 수
            있어요.
          </p>
          {waiting && <p role='status'>다음 미리듣기를 기다리고 있어요.</p>}
          <LearningOptions
            settings={settings}
            saving={savingSettings}
            error={settingsError}
            actualRate={actualRate}
            ready={playerReady}
            onChange={(next) => void changeSettings(next)}
          />
          <details>
            <summary>키보드 단축키</summary>
            <ul className={styles.shortcutList}>
              <li>답안 입력 중 Ctrl+R: 다시 듣기</li>
              <li>입력창 밖 Space: 재생 / 일시정지</li>
              <li>Shift+←: 현재 구절 안에서 2초 뒤로</li>
              <li>Enter: 답안 제출 · Tab: 다음 항목으로 이동</li>
            </ul>
            <p className={[styles.muted, styles.small].join(' ')}>
              YouTube 영상 내부에 포커스가 있으면 서비스 단축키가 적용되지
              않아요.
            </p>
          </details>
        </Panel>
        {complete ? (
          <Panel className={[styles.completion].join(' ')}>
            <p className={styles.eyebrow}>학습 결과</p>
            <h2>마지막 구절까지 도착했어요.</h2>
            <p>
              {mode === 'full' ? '풀 타이핑' : '빈칸 채우기'} · 전체{' '}
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
            <div className={styles.row}>
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
            </div>
          </Panel>
        ) : (
          <Panel className={[styles.answerPanel].join(' ')}>
            <div className={styles.sectionHeading}>
              <h2>
                구절 {index + 1} / {segments.length}
              </h2>
              <label className={styles.modeLabel}>
                모드
                <select
                  value={mode}
                  disabled={busy}
                  onChange={(event) =>
                    void navigate(index, event.target.value as Mode)
                  }>
                  <option value='full'>풀 타이핑</option>
                  <option value='blank'>빈칸 채우기</option>
                </select>
              </label>
            </div>
            <progress
              max={segments.length}
              value={index}
              aria-label='학습 진행'
            />
            <Button
              variant='secondary'
              disabled={busy}
              aria-pressed={difficultSegmentIds.includes(segment.id)}
              onClick={() => void toggleDifficulty()}>
              {difficultSegmentIds.includes(segment.id)
                ? '안 들리는 구절 표시 해제'
                : '안 들리는 구절로 표시'}
            </Button>
            <p className={[styles.muted, styles.small].join(' ')}>
              {segment.start.toFixed(1)}초 ~ {segment.end.toFixed(1)}초 · 듣고
              빈칸에 입력해 주세요.
            </p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void submit();
              }}>
              {mode === 'full' ? (
                <>
                  <label htmlFor='answer'>들리는 문장</label>
                  <textarea
                    id='answer'
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
                </>
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
                          Array.isArray(draft) ? (draft[position] ?? '') : ''
                        }
                        onChange={(event) => {
                          const next = Array.isArray(draft)
                            ? [...draft]
                            : segment.blanks.map(() => '');
                          next[position] = event.target.value;
                          changeDraft(next);
                        }}
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
                    );
                  })}
                </div>
              )}
              <div className={styles.row}>
                <Button disabled={busy}>
                  {busy ? '저장 중…' : '확인 (Enter)'}
                </Button>
                <Button
                  type='button'
                  variant='secondary'
                  disabled={busy}
                  onClick={() => void reveal()}>
                  정답 보기
                </Button>
                <Button
                  type='button'
                  variant='secondary'
                  disabled={busy}
                  onClick={() => void skip()}>
                  건너뛰기
                </Button>
              </div>
            </form>
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
            {state?.revealed && (
              <div className={styles.notice}>
                <strong>정답</strong>
                <p lang='en'>{segment.text}</p>
                <p className={[styles.muted, styles.small].join(' ')}>
                  음성 인식 결과에 오류가 있으면 이 구절을 건너뛸 수 있어요.
                </p>
              </div>
            )}
            <div className={[styles.row, styles.navigation].join(' ')}>
              <Button
                variant='secondary'
                disabled={busy || index === 0}
                onClick={() => void navigate(index - 1)}>
                이전 구절
              </Button>
              <Button
                variant='secondary'
                disabled={busy}
                onClick={() => void navigate(index + 1)}>
                다음 구절
              </Button>
            </div>
          </Panel>
        )}
      </div>
      <Panel>
        <h2>학습 기록 초기화</h2>
        <p className={styles.muted}>
          이 영상의 두 모드 답안, 안 들리는 구절 표시와 모든 학습 기록을
          삭제하고 처음부터 시작합니다. 다른 영상과 다른 사용자의 기록은
          유지됩니다.
        </p>
        <Button
          variant='secondary'
          disabled={busy}
          onClick={() => void reset()}>
          이 영상 기록 초기화
        </Button>
      </Panel>
    </>
  );
}
