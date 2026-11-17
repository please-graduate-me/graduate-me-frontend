import { describe, expect, it } from 'vitest';
import { archiveAssignmentDraft } from './drafts';
import { assignmentSchema } from '../model/contracts';

const assignment = assignmentSchema.parse({
  id: 'assignment',
  courseId: 'course',
  version: 1,
  title: '과제',
  source: {
    kind: 'video',
    fromIndex: 0,
    toIndex: 0,
    blankRatio: 20,
    id: 'video',
    title: '영상',
    language: 'en',
    version: 2,
    tasks: [
      {
        id: 'segment',
        text: null,
        version: 2,
        blanks: [1, 2],
        units: ['A', null, null],
      },
    ],
  },
  mode: 'blank',
  dueAt: '',
  allowLate: true,
  allowResubmit: true,
  allowHints: false,
  revealAfterSubmit: false,
  createdAt: '',
  updatedAt: '',
  submissions: [],
  revisions: [],
});

describe('과제 변경 전 미제출 초안 보존', () => {
  it('이전 버전과 빈칸 배열을 보관하고 다음 입력 변경으로부터 분리한다', () => {
    const values = ['first', 'second'];
    const saved = archiveAssignmentDraft(assignment, { segment: values });

    values[0] = '새 과제 입력';

    expect(saved).toEqual({
      version: 1,
      answers: [{ label: '구절 1', answer: ['first', 'second'] }],
    });
  });

  it('작성하지 않은 과제에 임의의 이전 답안을 만들지 않는다', () => {
    expect(archiveAssignmentDraft(assignment, {})).toBeNull();
  });
});
