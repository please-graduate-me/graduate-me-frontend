'use client';
import { blankIndices, gradeAnswer } from '@/domains/videos/lib/grading';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/primitives/Button';
import { Panel } from '@/components/ui/layouts/Panel';
import { getDemoLesson } from '@/domains/videos/api/demo';
import { demoYoutubeId, type DemoLesson } from '@/domains/videos/model/demo';
import { useYouTubePlayer } from './useYouTubePlayer';
import * as styles from './DemoStudy.css';

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
  const segment = lesson?.segments[index];

  const {
    mount,
    error: playbackError,
    ready,
    replay,
    toggle,
    playing,
    buffering,
    blocked,
    pause,
  } = useYouTubePlayer(demoYoutubeId, segment, {
    autoReplay: false,
    replayDelay: 1,
    replayCount: 1,
    playbackRate: 1,
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

  return (
    <Panel>
      <h2>로그인 없이 체험하기</h2>
      <p>짧은 구절을 듣고 직접 입력해 보세요. 체험 기록은 저장되지 않습니다.</p>
      <div
        className={styles.player}
        ref={mount}
      />
      {playbackError && <p role='alert'>{playbackError}</p>}
      {error && <p role='alert'>{error}</p>}
      {!segment && (
        <p role='status'>
          {lesson?.status === 'failed'
            ? '체험 영상의 학습 자료를 준비하지 못했습니다. 잠시 후 다시 방문해 주세요.'
            : '체험 영상의 학습 자료를 준비하고 있습니다.'}
        </p>
      )}
      {segment && (
        <>
          <div className={styles.controls}>
            <label>
              학습 방식{' '}
              <select
                value={mode}
                onChange={(event) => {
                  setMode(event.target.value as 'full' | 'blank');
                  reset();
                }}>
                <option value='full'>문장 타이핑</option>
                <option value='blank'>빈칸 채우기</option>
              </select>
            </label>
            <label>
              구절{' '}
              <select
                value={index}
                onChange={(event) => {
                  pause();
                  setIndex(Number(event.target.value));
                  reset();
                }}>
                {lesson.segments.map((item, i) => (
                  <option
                    key={item.id}
                    value={i}>
                    {i + 1}번째 · {Math.floor(item.start / 60)}:
                    {String(Math.floor(item.start % 60)).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </label>
            <Button
              disabled={!ready}
              onClick={replay}>
              구절 듣기
            </Button>
            <Button
              variant='secondary'
              disabled={!ready}
              onClick={toggle}>
              {playing ? '일시정지' : '재생'}
            </Button>
            <span role='status'>
              {buffering ? '불러오는 중' : playing ? '재생 중' : '대기 중'}
            </span>
          </div>
          {blocked && <p>영상의 재생 버튼을 눌러 주세요.</p>}
          <form
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
            }}>
            {mode === 'full' ? (
              <label>
                들리는 문장을 입력하세요
                <textarea
                  className={styles.answer}
                  maxLength={2000}
                  value={draft}
                  onChange={(event) => {
                    setDraft(event.target.value);
                    setFeedback('');
                  }}
                  spellCheck={false}
                  autoComplete='off'
                />
              </label>
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
                      />
                    );
                  })}
              </div>
            )}
            <div className={styles.controls}>
              <Button>정답 확인</Button>
              <Button
                type='button'
                variant='secondary'
                onClick={() => setRevealed(true)}>
                정답 보기
              </Button>
              <Button
                type='button'
                variant='secondary'
                disabled={index === lesson.segments.length - 1}
                onClick={() => {
                  pause();
                  setIndex(index + 1);
                  reset();
                }}>
                다음 구절
              </Button>
              <Button
                type='button'
                variant='secondary'
                onClick={() => {
                  pause();
                  setIndex(0);
                  reset();
                }}>
                처음부터
              </Button>
            </div>
          </form>
          {feedback && <p role='status'>{feedback}</p>}
          {revealed && <p>{segment.text}</p>}
        </>
      )}
    </Panel>
  );
}
