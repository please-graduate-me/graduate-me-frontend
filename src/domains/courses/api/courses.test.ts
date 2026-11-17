import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAssignment, listMyAssignments, submitAssignment } from './courses';

afterEach(() => vi.unstubAllGlobals());

describe('수업 과제 학생 계약', () => {
  it('제출 전 가려진 원문과 정답을 요구하지 않고 과제 버전을 복원한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          id: 'assignment',
          courseId: 'course',
          version: 2,
          title: '듣기 과제',
          mode: 'full',
          dueAt: '2026-11-10T00:00:00Z',
          allowLate: true,
          allowResubmit: true,
          allowHints: false,
          revealAfterSubmit: false,
          createdAt: '',
          updatedAt: '',
          submissions: [],
          revisions: [],
          hints: [{ taskId: 'segment', hintCount: 2, hint: 'Learning is' }],
          source: {
            kind: 'video',
            fromIndex: 0,
            toIndex: 0,
            blankRatio: 20,
            id: 'video',
            title: '공개 영상',
            language: 'en',
            version: 3,
            youtubeId: 'abcdefghijk',
            tasks: [
              {
                id: 'segment',
                text: null,
                version: 3,
                start: 1,
                end: 3,
                blanks: [],
                units: [],
              },
            ],
          },
        })
      )
    );

    const value = await getAssignment('course', 'assignment');

    expect(value.source.tasks[0].text).toBeNull();
    expect(value.source.tasks[0].units).toEqual([]);
    expect(value.version).toBe(2);
    expect(value.source.version).toBe(3);
    expect(value.revealAfterSubmit).toBe(false);

    expect(value.hints).toEqual([
      { taskId: 'segment', hintCount: 2, hint: 'Learning is' },
    ]);
  });

  it('수강 과제 요약은 미제출 여부와 이전 버전 제출을 함께 복원한다', async () => {
    const fetcher = vi.fn(async () =>
      Response.json({
        items: [
          {
            id: 'assignment',
            courseId: 'course',
            courseTitle: '수업',
            courseLanguage: 'en',
            title: '읽기 과제',
            version: 2,
            mode: 'reading',
            dueAt: '2026-11-20T00:00:00Z',
            allowLate: false,
            allowResubmit: true,
            source: { kind: 'pdf', id: 'material', title: '자료' },
            taskCount: 1,
            submitted: true,
            submission: {
              version: 1,
              createdAt: '',
              late: false,
              outdated: true,
            },
          },
        ],
      })
    );

    vi.stubGlobal('fetch', fetcher);
    const value = await listMyAssignments();

    expect(value.items[0].submission?.outdated).toBe(true);

    expect(String((fetcher.mock.calls[0] as unknown as [string])[0])).toBe(
      '/api/courses/assignments'
    );
  });

  it('과제 제출 요청 식별자와 버전을 개인 기록과 별도 경로로 전달한다', async () => {
    const fetch = vi.fn(async () =>
      Response.json({
        id: 'submission',
        assignmentId: 'assignment',
        userId: 'student',
        version: 2,
        answers: [{ id: 'segment', answer: 'my answer' }],
        result: [{ id: 'segment', correct: false }],
        late: false,
        createdAt: '',
        assignmentSnapshot: { privateExpected: '정답 비노출' },
      })
    );

    vi.stubGlobal('fetch', fetch);

    const input = {
      requestId: '11111111-1111-4111-8111-111111111111',
      version: 2,
      answers: [{ id: 'segment', answer: 'my answer' }],
    };

    const value = await submitAssignment('course', 'assignment', input);
    const call = fetch.mock.calls[0] as unknown as [string, RequestInit];

    expect(call[0]).toBe(
      '/api/courses/course/assignments/assignment/submissions'
    );

    expect(JSON.parse(String(call[1].body))).toEqual(input);
    expect(value.result[0].expected).toBeUndefined();
    expect(value).not.toHaveProperty('assignmentSnapshot');
  });
});
