import type { DemoLesson } from '../model/demo';
import type { ActionResult, LearningAction, Lesson } from '../model/contracts';
import { blankIndices, gradeAnswer } from './grading';

/** 공개 자료를 공통 학습 화면에 연결하되 계정 기록은 만들지 않는다. */
export function createDemoLesson(demo: DemoLesson): Lesson {
  return {
    settings: {
      autoReplay: false,
      replayDelay: 1,
      replayCount: null,
      playbackRate: 1,
    },
    video: {
      id: 'demo',
      youtubeId: demo.youtubeId,
      title: '체험 영상',
      duration: null,
      downloadedAt: null,
      category: null,
      liked: false,
      likeCount: 0,
    },
    job: { status: demo.status, attempts: 0, errorMessage: null },
    progress: { currentIndex: 0, mode: 'blank', favorite: false },
    difficultSegmentIds: [],
    segments: demo.segments.map((segment, index) => ({
      ...segment,
      index,
      blanks: blankIndices(segment.text),
      words: [],
    })),
    states: [],
  };
}

/** 체험에서도 동일한 채점 결과와 다음 위치를 공통 학습 흐름에 전달한다. */
export function applyDemoLearningAction(
  lesson: Lesson,
  input: LearningAction
): ActionResult {
  if (input.action === 'reset') return { ok: true };

  if (input.action === 'navigate') {
    if (input.index > lesson.segments.length)
      throw new Error('구절 범위를 벗어났습니다.');

    return { ok: true };
  }

  const index = lesson.segments.findIndex(
    (segment) => segment.id === input.segmentId
  );

  const segment = lesson.segments[index];

  if (!segment) throw new Error('학습 구절을 찾을 수 없습니다.');
  if (input.action === 'difficulty') return { ok: true };
  if (input.action === 'reveal') return { text: segment.text };
  if (input.action === 'skip') return { nextIndex: index + 1 };
  if (!('answer' in input)) throw new Error('지원하지 않는 동작입니다.');
  if (
    input.mode === 'full'
      ? typeof input.answer !== 'string'
      : !Array.isArray(input.answer) ||
        input.answer.length !== segment.blanks.length
  )
    throw new Error('학습 모드에 맞는 답안을 입력해 주세요.');
  if (input.action === 'draft') return { ok: true };

  const grade = gradeAnswer(segment.text, input.mode, input.answer);

  return { grade, nextIndex: grade.correct ? index + 1 : index };
}
