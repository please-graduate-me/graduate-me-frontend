import { describe, expect, it } from 'vitest';
import { lessonSchema } from './contracts';
import { sessionSchema } from '../../auth/model/contracts';

const lesson = {
  settings: {
    autoReplay: false,
    replayDelay: 1,
    replayCount: 1,
    playbackRate: 1,
  },
  video: {
    id: 'video',
    youtubeId: 'youtube',
    title: '영상',
    duration: null,
    category: null,
    liked: false,
    likeCount: 0,
    analysisVersion: 'v1',
  },
  job: null,
  progress: { currentIndex: 0, mode: 'full', favorite: false },
  difficultSegmentIds: [],
  segments: [],
  states: [],
};

describe('학습 계약', () => {
  it('미로그인 세션은 null이며 사용자 식별자는 필수다', () => {
    expect(sessionSchema.parse(null)).toBeNull();

    expect(
      sessionSchema.safeParse({
        user: { name: '사용자' },
        expires: '2026-12-01',
      }).success
    ).toBe(false);
  });

  it('서버의 문자열 분석 버전이 포함된 학습 응답을 읽는다', () => {
    expect(lessonSchema.parse(lesson).video.analysisVersion).toBe('v1');

    expect(
      lessonSchema.safeParse({
        ...lesson,
        video: { ...lesson.video, analysisVersion: 1 },
      }).success
    ).toBe(false);
  });

  it('응답의 지원하지 않는 학습 모드를 거부한다', () => {
    const result = lessonSchema.safeParse({
      ...lesson,
      progress: { ...lesson.progress, mode: 'unknown' },
    });

    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues.map((issue) => issue.path)).toEqual([
        ['progress', 'mode'],
      ]);
  });
});
