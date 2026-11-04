'use client';
import { useAnswerViewport } from './useAnswerViewport';
import { blankIndices, gradeAnswer } from '@/domains/videos/lib/grading';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/primitives/Button';
import { getDemoLesson } from '@/domains/videos/api/demo';
import { demoYoutubeId, type DemoLesson } from '@/domains/videos/model/demo';
import { useYouTubePlayer } from './useYouTubePlayer';
import * as styles from './DemoStudy.css';
import { LearningModeSwitch } from '@/domains/videos/ui/LearningModeSwitch';
import { SegmentList } from '@/domains/videos/ui/SegmentList';

/** 공개 체험의 답안과 채점은 브라우저에만 두고 계정 기록에 저장하지 않는다. */
export function DemoStudy() {
  const [lesson, setLesson] = useState<DemoLesson | null>(null);
  const [error, setError] = useState('');
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<'full' | 'blank'>('full');
  const [draft, setDraft] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [focused, setFocused] = useState(false);
  const answerForm = useAnswerViewport(focused);
  const [completed, setCompleted] = useState<string[]>([]);

  const [playbackRate, setPlaybackRate] = useState<0.5 | 0.75 | 1 | 1.25 | 1.5>(
    1
  );

  const segment = lesson?.segments[index];

  const {
    mount,
    error: playbackError,
    ready,
    replay,
    rewind,
    toggle,
    playing,
    buffering,
    blocked,
    pause,
  } = useYouTubePlayer(demoYoutubeId, segment, {
    autoReplay: false,
    replayDelay: 1,
    replayCount: 1,
    playbackRate,
  });

  useEffect(() => {
    let disposed = false;
    let timer: ReturnType<typeof setTimeout>;

    async function refresh() {
      try {
        const result = await getDemoLesson();

        if (disposed) return;
        setLesson(result);
        setError('');
        if (result.status === 'preparing') timer = setTimeout(refresh, 5000);
      } catch {
        if (!disposed) {
          setError('체험 자료를 불러오지 못했습니다. 잠시 후 다시 확인합니다.');
          timer = setTimeout(refresh, 10000);
        }
      }
    }

    void refresh();

    return () => {
      disposed = true;
      clearTimeout(timer);
    };
  }, []);

  function reset() {
    setDraft('');
    setAnswers([]);
    setFeedback('');
    setRevealed(false);
  }

  const blanks = segment ? blankIndices(segment.text) : [];

  function move(next: number) {
    pause();
    setIndex(next);
    reset();
  }

  return (
    <section
      className={styles.root}
      id='demo-study'
      aria-label='로그인 없이 체험하기'
      data-focused={focused || undefined}>
      <header className={styles.heading}>
        <div>
          <h2>로그인 없이 체험하기</h2>
          <p>
            짧은 구절을 듣고 직접 입력해 보세요. 체험 기록은 저장되지 않습니다.
          </p>
        </div>
        <span
          className={styles.status}
          role='status'>
          {buffering ? '불러오는 중' : playing ? '재생 중' : '듣기 연습'}
        </span>
      </header>
      <div className={styles.progressHeading}>
        <strong>
          구절 {String(index + 1).padStart(2, '0')}{' '}
          <span>/ {lesson?.segments.length ?? 0}</span>
        </strong>
        <span>
          {segment
            ? `${segment.start.toFixed(0)}초 ~ ${segment.end.toFixed(0)}초`
            : '자료 준비 중'}
        </span>
      </div>
      {error && <p role='alert'>{error}</p>}
      <div className={styles.grid}>
        <div className={styles.writing}>
          <div className={styles.answerHeading}>
            <h3>들리는 대로 적어보세요.</h3>
            <span>체험 모드</span>
          </div>
          <p className={styles.help}>한 번에 다 듣지 않아도 괜찮아요.</p>
          <LearningModeSwitch
            mode={mode}
            onChange={(next) => {
              setMode(next);
              reset();
            }}
          />
          {segment ? (
            <>
              <form
                ref={answerForm}
                onFocusCapture={() => setFocused(true)}
                onSubmit={(event) => {
                  event.preventDefault();

                  const result = gradeAnswer(
                    segment.text,
                    mode,
                    mode === 'full' ? draft : answers
                  );

                  setFeedback(
                    result.correct
                      ? '정답입니다! 다음 구절도 들어보세요.'
                      : '아직 일치하지 않는 부분이 있어요. 다시 듣고 수정해 보세요.'
                  );

                  if (result.correct)
                    setCompleted((ids) =>
                      ids.includes(segment.id) ? ids : [...ids, segment.id]
                    );
                }}>
                {mode === 'full' ? (
                  <textarea
                    className={styles.answer}
                    aria-label='들리는 문장'
                    placeholder='들은 내용을 영어로 적어 주세요.'
                    maxLength={2000}
                    value={draft}
                    onChange={(event) => {
                      setDraft(event.target.value);
                      setFeedback('');
                    }}
                    spellCheck={false}
                    autoComplete='off'
                    autoCorrect='off'
                    autoCapitalize='off'
                  />
                ) : (
                  <div className={styles.blanks}>
                    {segment.text
                      .trim()
                      .split(/\s+/)
                      .map((word, i) => {
                        const position = blanks.indexOf(i);

                        return position < 0 ? (
                          <span key={i}>{word} </span>
                        ) : (
                          <input
                            key={i}
                            aria-label={`${position + 1}번째 빈칸`}
                            maxLength={100}
                            value={answers[position] ?? ''}
                            onChange={(event) => {
                              const next = [...answers];

                              next[position] = event.target.value;
                              setAnswers(next);
                              setFeedback('');
                            }}
                            spellCheck={false}
                            autoComplete='off'
                            autoCorrect='off'
                            autoCapitalize='off'
                          />
                        );
                      })}
                  </div>
                )}
                <div className={styles.actions}>
                  <Button
                    type='button'
                    variant='secondary'
                    onClick={() => setRevealed(true)}>
                    정답 보기
                  </Button>
                  <Button className={styles.confirm}>확인하기</Button>
                </div>
              </form>
              <div className={styles.secondary}>
                <button
                  type='button'
                  onClick={() => move(0)}>
                  처음부터
                </button>
                <button
                  type='button'
                  disabled={index === lesson.segments.length - 1}
                  onClick={() => move(index + 1)}>
                  다음 구절
                </button>
              </div>
              {feedback && (
                <p
                  className={styles.feedback}
                  role='status'>
                  {feedback}
                </p>
              )}
              {revealed && (
                <p
                  className={styles.feedback}
                  lang='en'>
                  {segment.text}
                </p>
              )}
            </>
          ) : (
            <p role='status'>
              {lesson?.status === 'failed'
                ? '체험 영상의 학습 자료를 준비하지 못했습니다. 잠시 후 다시 방문해 주세요.'
                : '체험 영상의 학습 자료를 준비하고 있습니다.'}
            </p>
          )}
          <p className={styles.note}>
            Google 계정으로 로그인하면 내 영상의 답안과 진도를 저장할 수 있어요.
          </p>
        </div>
        <div className={styles.media}>
          <div
            className={styles.player}
            ref={mount}
          />
          <div className={styles.playback}>
            <Button
              variant='secondary'
              className={styles.playbackButton}
              disabled={!ready}
              onClick={rewind}>
              2초 전
            </Button>
            <Button
              className={[styles.playbackButton, styles.replay].join(' ')}
              variant='secondary'
              disabled={!ready}
              onClick={replay}>
              다시 듣기
            </Button>
            <select
              aria-label='재생 속도'
              value={playbackRate}
              onChange={(event) =>
                setPlaybackRate(
                  Number(event.target.value) as typeof playbackRate
                )
              }>
              {([0.5, 0.75, 1, 1.25, 1.5] as const).map((rate) => (
                <option
                  key={rate}
                  value={rate}>
                  {rate}배
                </option>
              ))}
            </select>
          </div>
          <div className={styles.settings}>
            <button
              type='button'
              disabled={!ready}
              onClick={toggle}>
              {playing ? '일시정지' : '재생'}
            </button>
            <span>구절 끝에서 자동으로 멈춰요</span>
            {focused && (
              <button
                type='button'
                className={styles.showVideo}
                onClick={() => setFocused(false)}>
                영상 보기
              </button>
            )}
          </div>
          {playbackError && <p role='alert'>{playbackError}</p>}
          {blocked && <p>영상의 재생 버튼을 눌러 주세요.</p>}
        </div>
        <div className={styles.segmentArea}>
          <SegmentList
            items={(lesson?.segments ?? []).map((item) => ({
              ...item,
              status: completed.includes(item.id) ? 'correct' : 'pending',
            }))}
            currentIndex={index}
            onSelect={move}
          />
        </div>
      </div>
    </section>
  );
}
