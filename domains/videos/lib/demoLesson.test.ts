import { describe, expect, it } from 'vitest';
import { demoYoutubeId } from '../model/demo';
import { lessonSchema, type Mode } from '../model/contracts';
import { applyDemoLearningAction, createDemoLesson } from './demoLesson';

const lesson = createDemoLesson({
  youtubeId: demoYoutubeId,
  status: 'ready',
  segments: [
    {
      id: 'first',
      start: 3,
      end: 6,
      text: 'We went to the park and stayed for a while.',
    },
    { id: 'last', start: 7, end: 10, text: 'I am here.' },
  ],
});

function submit(segmentId: string, mode: Mode, answer: string | string[]) {
  return applyDemoLearningAction(lesson, {
    action: 'submit',
    segmentId,
    mode,
    answer,
    requestId: '00000000-0000-4000-8000-000000000001',
  });
}

describe('공통 학습 화면의 체험 연결', () => {
  it('구절 순서와 재생 구간을 유지하고 기존 학습 계약을 만족한다', () => {
    expect(lessonSchema.parse(lesson)).toEqual(lesson);

    expect(lesson.segments[0]).toMatchObject({
      id: 'first',
      index: 0,
      start: 3,
      end: 6,
      blanks: [0, 2],
    });

    expect(lesson.progress.mode).toBe('blank');
  });

  it('전체 받아쓰기 정답은 다음 구절로 이동하고 오답은 현재 구절에 남는다', () => {
    expect(
      submit('first', 'full', 'we went to the park and stayed for a while')
    ).toMatchObject({ grade: { correct: true }, nextIndex: 1 });

    expect(submit('first', 'full', 'we went park')).toMatchObject({
      grade: { correct: false },
      nextIndex: 0,
    });
  });

  it('빈칸도 같은 규칙으로 채점하고 마지막 정답은 완료 위치로 이동한다', () => {
    expect(submit('first', 'blank', ['WE', 'to'])).toMatchObject({
      grade: { correct: true },
      nextIndex: 1,
    });

    expect(submit('first', 'blank', ['we', 'at'])).toMatchObject({
      grade: { correct: false },
      nextIndex: 0,
    });

    expect(submit('last', 'blank', ['i'])).toMatchObject({
      grade: { correct: true },
      nextIndex: lesson.segments.length,
    });
  });

  it('마지막 구절 건너뛰기도 완료 위치를 반환한다', () => {
    expect(
      applyDemoLearningAction(lesson, {
        action: 'skip',
        segmentId: 'last',
        mode: 'full',
      })
    ).toEqual({ nextIndex: 2 });
  });

  it('없는 구절과 모드에 맞지 않는 답안은 거부한다', () => {
    expect(() => submit('missing', 'full', 'hello')).toThrow();
    expect(() => submit('first', 'full', ['we'])).toThrow();
    expect(() => submit('first', 'blank', ['we'])).toThrow();

    expect(() =>
      applyDemoLearningAction(lesson, {
        action: 'navigate',
        index: 3,
        mode: 'blank',
      })
    ).toThrow();
  });

  it('완료 후 복습과 모드 전환을 허용하고 대본을 반환한다', () => {
    expect(
      applyDemoLearningAction(lesson, {
        action: 'navigate',
        index: 2,
        mode: 'blank',
      })
    ).toEqual({ ok: true });

    expect(
      applyDemoLearningAction(lesson, {
        action: 'navigate',
        index: 0,
        mode: 'full',
      })
    ).toEqual({ ok: true });

    expect(
      applyDemoLearningAction(lesson, {
        action: 'reveal',
        segmentId: 'first',
        mode: 'blank',
      })
    ).toEqual({ text: lesson.segments[0].text });
  });
});
